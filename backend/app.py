import os
from dotenv import load_dotenv
import json
import pprint
import requests
from datetime import datetime, timedelta

from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
import yfinance as yf
import pandas as pd
import numpy as np
# from openai import OpenAI
import cohere

app = Flask(__name__)

CORS(app, supports_credentials=True)

load_dotenv(dotenv_path=".env")

mongo_client = MongoClient(os.environ.get('MONGODB_URI'))
db = mongo_client['test']

# openai_client = OpenAI(api_key=os.environ.get('OPENAI_KEY'))
cohere_client = cohere.ClientV2(api_key=os.environ.get('COHERE_KEY'))

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/test/users', methods=['POST'])
def test_new_user():
    data = request.json
    print(data)

    db['users'].insert_one({"username": data.get("username"), "password": data.get("password")})
    return 'Success!'

@app.route('/api/chat', methods=['POST'])
def send_chat():

    try:
        # Get user input from the frontend
        data = request.json
        user_message = data.get('message')
        
        messages = [{"role": "user", "content": user_message}]

        response = cohere_client.chat(
            model="command-r",
            messages=messages
        )

        # Send the reply back to the frontend
        return jsonify({"reply": response.message.content[0].text})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/stocks/<symbol>')
def get_stock_data(symbol):
    try:
        # Get window parameters from request body
        data = request.json
        window_size = int(data.get('window_size', 6))  # default 6
        window_unit = data.get('window_unit', 'months')  # default months
        
        # Calculate interval based on window size
        interval_str, min_periods = calculate_interval(window_size, window_unit)
        
        # Calculate date range
        end_date = datetime.now()
        delta = get_time_delta(window_size, window_unit)
        start_date = end_date - delta
        
        # Create ticker object
        ticker = yf.Ticker(symbol)
        
        # Get historical data
        df = ticker.history(
            start=start_date,
            end=end_date,
            interval=interval_str,
            actions=False
        )
        
        # Calculate stats
        stats = {
            'average_price': convert_to_native_types(df['Close'].mean()),
            'highest_price': convert_to_native_types(df['High'].max()),
            'lowest_price': convert_to_native_types(df['Low'].min()),
            'total_volume': convert_to_native_types(df['Volume'].sum()),
            'window_size': window_size,
            'window_unit': window_unit,
            'interval_used': interval_str
        }
        
        # Convert DataFrame to list of dictionaries
        result = []
        for index, row in df.iterrows():
            data_point = {
                'date': index.strftime('%Y-%m-%d'),
                'open': convert_to_native_types(row['Open']),
                'close': convert_to_native_types(row['Close']),
                'high': convert_to_native_types(row['High']),
                'low': convert_to_native_types(row['Low']),
                'volume': convert_to_native_types(row['Volume']),
                'stats': stats
            }
            result.append(data_point)
        
        return jsonify({
            'status': 'success',
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

def calculate_interval(time_window, unit):
    """
    Calculate appropriate interval based on the time window
    Returns tuple of (interval_str, min_periods) where min_periods is the threshold 
    for when this interval should be used
    """
    INTERVALS = {
        'years': ('1y', 3),   # 3+ years -> yearly interval
        'months': ('1mo', 3), # 3+ months -> monthly interval
        'weeks': ('1wk', 3),  # 3+ weeks -> weekly interval
        'days': ('1d', 3),    # 3+ days -> daily interval
    }
    
    return INTERVALS.get(unit, ('1d', 0))  # Default to daily if unit not recognized

def get_time_delta(value, unit):
    """Convert value and unit to timedelta"""
    unit_mapping = {
        'years': lambda x: timedelta(days=x*365),
        'months': lambda x: timedelta(days=x*30),
        'weeks': lambda x: timedelta(weeks=x),
        'days': lambda x: timedelta(days=x),
    }
    return unit_mapping.get(unit, lambda x: timedelta(days=x))(value)

def convert_to_native_types(obj, decimal_places=3):
    """Convert numpy/pandas data types to native Python types and round values to specified decimal places."""
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return round_to_decimal_places(float(obj), decimal_places)
    elif isinstance(obj, np.ndarray):
        return [round_to_decimal_places(x, decimal_places) if isinstance(x, (int, float)) else x for x in obj.tolist()]
    elif isinstance(obj, (int, float)):
        return round_to_decimal_places(obj, decimal_places)
    return obj

def round_to_decimal_places(value, decimal_places=3):
    """Round a number to a specified number of decimal places."""
    if isinstance(value, (int, float)):
        return round(value, decimal_places)
    return value

if __name__ == '__main__':

    # just for the sake of testing, feel free to delete later
    # data = yf.Ticker("AMZN").history(period="6mo")
    # data_dict = data.reset_index().to_dict(orient="records")
    # # print(data_dict)
    # pprint.pprint(data_dict)

    app.run(host='0.0.0.0', port=5000, threaded=True)
