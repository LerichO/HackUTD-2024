import os
from dotenv import load_dotenv
import json
import pprint
import requests

from flask import Flask, request, jsonify, Response, make_response
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
import yfinance as yf
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
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':

    # just for the sake of testing, feel free to delete later
    # data = yf.Ticker("AMZN")
    # pprint.pprint(data.info)

    app.run(host='0.0.0.0', port=5000, threaded=True)
