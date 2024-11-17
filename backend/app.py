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

app = Flask(__name__)

CORS(app, supports_credentials=True)

load_dotenv(dotenv_path=".env")

print("MONGODB:", os.environ.get('MONGODB_URI'))

client = MongoClient(os.environ.get('MONGODB_URI'))
db = client['test']

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/test/users', methods=['POST'])
def test_new_user():
    data = request.json
    print(data)

    db['users'].insert_one({"username": data.get("username"), "password": data.get("password")})
    return 'Success!'


if __name__ == '__main__':

    # just for the sake of testing, feel free to delete later
    # data = yf.Ticker("AMZN")
    # pprint.pprint(data.info)

    app.run(host='0.0.0.0', port=5000, threaded=True)
