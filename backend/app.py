import os
from dotenv import load_dotenv
import json
import pprint
import requests
from datetime import datetime, timedelta

from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS
from pymongo import MongoClient
import yfinance as yf
import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
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

# get method is a POST requestt bc idk, GET can't handle request bodies
@app.route('/api/stocks/all/<symbol>/', methods=['POST'])
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

@app.route('/api/stocks/all/')
def get_top_performers():
    try:
        # Get list of major US tickers
        symbols = get_major_us_tickers()
        
        # Fetch data for all stocks in parallel
        performances = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_symbol = {executor.submit(get_stock_performance, symbol): symbol for symbol in symbols}
            
            for future in as_completed(future_to_symbol):
                result = future.result()
                if result is not None:
                    performances.append(result)
        
        # Sort by market cap to get the absolute largest companies
        largest_companies = sorted(performances, key=lambda x: x['market_cap'], reverse=True)[:5]
        
        # Add rank to each company
        for i, company in enumerate(largest_companies, 1):
            company['rank'] = i
        
        # Create market summary
        market_summary = {
            'total_market_cap_billions': convert_to_native_types(sum(p['market_cap_billions'] for p in largest_companies)),
            'average_monthly_return': convert_to_native_types(np.mean([p['monthly_return'] for p in largest_companies])),
            'average_pe_ratio': convert_to_native_types(np.mean([p['pe_ratio'] for p in largest_companies if p['pe_ratio'] is not None])),
            'companies_analyzed': len(performances),
            'timestamp': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
            'represented_sectors': list(set(p['sector'] for p in largest_companies if p['sector'] != 'Unknown')),
            'total_daily_volume': convert_to_native_types(sum(p['avg_daily_volume'] for p in largest_companies))
        }
        
        return jsonify({
            'status': 'success',
            'data': {
                'top_companies': largest_companies,
                'market_summary': market_summary
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400
    
@app.route('/api/stocks/low-risk')
def get_top_funds():
    try:
        # Get list of funds and bonds
        ticker_dict = get_major_fund_tickers()
        all_tickers = ticker_dict['Mutual Funds'] + ticker_dict['Bond Funds']
        
        # Fetch data for all funds in parallel
        performances = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_symbol = {executor.submit(get_fund_performance, symbol): symbol 
                              for symbol in all_tickers}
            
            for future in as_completed(future_to_symbol):
                result = future.result()
                if result is not None:
                    performances.append(result)
        
        # Sort by yearly return to get the top performers
        top_performers = sorted(performances, 
                              key=lambda x: x['returns']['yearly'], 
                              reverse=True)[:5]
        
        # Add rank to each fund
        for i, fund in enumerate(top_performers, 1):
            fund['rank'] = i
        
        # Create summary statistics
        summary = {
            'total_assets_analyzed_billions': convert_to_native_types(
                sum(p['total_assets_billions'] for p in performances)
            ),
            'average_returns': {
                'monthly': convert_to_native_types(
                    np.mean([p['returns']['monthly'] for p in performances])
                ),
                'quarterly': convert_to_native_types(
                    np.mean([p['returns']['quarterly'] for p in performances])
                ),
                'yearly': convert_to_native_types(
                    np.mean([p['returns']['yearly'] for p in performances])
                )
            },
            'average_expense_ratio': convert_to_native_types(
                np.mean([p['expense_ratio'] for p in performances])
            ),
            'average_yield': convert_to_native_types(
                np.mean([p['yield'] for p in performances])
            ),
            'average_volatility': convert_to_native_types(
                np.mean([p['volatility'] for p in performances])
            ),
            'funds_analyzed': len(performances),
            'timestamp': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
            'category_breakdown': {
                'Mutual Funds': len([p for p in performances if p['category'] == 'Mutual Fund']),
                'Bond Funds': len([p for p in performances if p['category'] == 'Bond Fund'])
            }
        }
        
        return jsonify({
            'status': 'success',
            'data': {
                'top_performers': top_performers,
                'summary': summary
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

def get_major_fund_tickers():
    """Get list of major mutual funds and bond ETFs"""
    return {
        'Mutual Funds': [
            'VFIAX',  # Vanguard 500 Index Fund
            'FXAIX',  # Fidelity 500 Index Fund
            'VTSAX',  # Vanguard Total Stock Market Index Fund
            'VTSMX',  # Vanguard Total Stock Market Index Fund
            'PRGFX',  # T. Rowe Price Growth Stock Fund
            'AGTHX',  # American Funds Growth Fund of America
            'VWELX',  # Vanguard Wellington Fund
            'FCNTX',  # Fidelity Contrafund
            'VWINX',  # Vanguard Wellesley Income Fund
            'VTHRX',  # Vanguard Target Retirement 2030 Fund
        ],
        'Bond Funds': [
            'AGG',    # iShares Core U.S. Aggregate Bond ETF
            'BND',    # Vanguard Total Bond Market ETF
            'LQD',    # iShares iBoxx $ Investment Grade Corporate Bond ETF
            'TLT',    # iShares 20+ Year Treasury Bond ETF
            'IEF',    # iShares 7-10 Year Treasury Bond ETF
            'MUB',    # iShares National Muni Bond ETF
            'HYG',    # iShares iBoxx $ High Yield Corporate Bond ETF
            'BNDX',   # Vanguard Total International Bond ETF
            'VCIT',   # Vanguard Intermediate-Term Corporate Bond ETF
            'VGLT',   # Vanguard Long-Term Treasury ETF
        ]
    }

def get_fund_performance(symbol):
    """Get performance metrics for a single fund or bond"""
    try:
        fund = yf.Ticker(symbol)
        info = fund.info
        
        # Get historical data for different time periods
        hist_1mo = fund.history(period="1mo")
        hist_3mo = fund.history(period="3mo")
        hist_1yr = fund.history(period="1y")
        
        if len(hist_1mo) == 0:
            return None
        
        # Calculate returns for different periods
        current_price = hist_1mo['Close'].iloc[-1]
        monthly_return = ((current_price - hist_1mo['Close'].iloc[0]) / hist_1mo['Close'].iloc[0]) * 100
        quarterly_return = ((current_price - hist_3mo['Close'].iloc[0]) / hist_3mo['Close'].iloc[0]) * 100
        yearly_return = ((current_price - hist_1yr['Close'].iloc[0]) / hist_1yr['Close'].iloc[0]) * 100
        
        # Calculate volatility (standard deviation of returns)
        volatility = np.std(hist_1yr['Close'].pct_change()) * np.sqrt(252) * 100  # Annualized volatility
        
        return {
            'symbol': symbol,
            'name': info.get('longName', symbol),
            'category': 'Bond Fund' if any(bond_keyword in info.get('categoryName', '').lower() 
                                         for bond_keyword in ['bond', 'fixed income', 'treasury']) 
                       else 'Mutual Fund',
            'current_price': convert_to_native_types(current_price),
            'returns': {
                'monthly': convert_to_native_types(monthly_return),
                'quarterly': convert_to_native_types(quarterly_return),
                'yearly': convert_to_native_types(yearly_return)
            },
            'total_assets': convert_to_native_types(info.get('totalAssets', 0)),
            'total_assets_billions': convert_to_native_types(info.get('totalAssets', 0) / 1e9),
            'expense_ratio': convert_to_native_types(info.get('annualReportExpenseRatio', 0) * 100),
            'yield': convert_to_native_types(info.get('yield', 0) * 100 if info.get('yield') else 0),
            'volatility': convert_to_native_types(volatility),
            'category_name': info.get('categoryName', 'Unknown'),
            'investment_strategy': info.get('fundFamily', 'Unknown')
        }
    except Exception as e:
        print(f"Error processing {symbol}: {str(e)}")
        return None

def get_major_us_tickers():
    """Get list of major US company tickers"""
    return [
        # Technology
        'AAPL',   # Apple
        'MSFT',   # Microsoft
        'GOOGL',  # Alphabet (Google)
        'AMZN',   # Amazon
        'META',   # Meta Platforms
        'NVDA',   # NVIDIA
        'AVGO',   # Broadcom
        'TSLA',   # Tesla
        
        # Financial
        'BRK-B',  # Berkshire Hathaway
        'JPM',    # JPMorgan Chase
        'V',      # Visa
        'MA',     # Mastercard
        'BAC',    # Bank of America
        
        # Healthcare
        'LLY',    # Eli Lilly
        'JNJ',    # Johnson & Johnson
        'UNH',    # UnitedHealth
        'ABBV',   # AbbVie
        'MRK',    # Merck
        
        # Consumer
        'WMT',    # Walmart
        'PG',     # Procter & Gamble
        'KO',     # Coca-Cola
        'PEP',    # PepsiCo
        'COST',   # Costco
        'MCD',    # McDonald's
    ]

def get_stock_performance(symbol):
    """Get performance metrics for a single stock"""
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Get recent price data
        hist = stock.history(period="1mo")
        
        if len(hist) == 0:
            return None
        
        # Calculate performance metrics
        current_price = hist['Close'].iloc[-1]
        start_price = hist['Close'].iloc[0]
        monthly_return = ((current_price - start_price) / start_price) * 100
        
        # Calculate average daily volume
        avg_volume = hist['Volume'].mean()
        
        return {
            'symbol': symbol,
            'name': info.get('longName', symbol),
            'current_price': convert_to_native_types(current_price),
            'monthly_return': convert_to_native_types(monthly_return),
            'market_cap': convert_to_native_types(info.get('marketCap', 0)),
            'market_cap_billions': convert_to_native_types(info.get('marketCap', 0) / 1e9),
            'sector': info.get('sector', 'Unknown'),
            'industry': info.get('industry', 'Unknown'),
            'exchange': info.get('exchange', 'Unknown'),
            'avg_daily_volume': convert_to_native_types(avg_volume),
            'pe_ratio': convert_to_native_types(info.get('forwardPE', None)),
            'dividend_yield': convert_to_native_types(info.get('dividendYield', 0) * 100 if info.get('dividendYield') else 0)
        }
    except Exception as e:
        print(f"Error processing {symbol}: {str(e)}")
        return None

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
