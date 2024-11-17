from flask import Flask
import json
import pprint
import yfinance as yf

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"


if __name__ == '__main__':
    data = yf.Ticker("AMZN")
    print("bruh")

    pprint.pprint(data.info)
    app.run(debug=True)
