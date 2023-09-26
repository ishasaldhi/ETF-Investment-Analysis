# Import the dependencies.
import sqlalchemy 
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask import render_template

from pymongo import MongoClient


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

#Connecting to Mongo
mongo = MongoClient(port=27017)
db = mongo['alphaVantage_db']
data = db['data']



#################################################
# Flask Routes
#################################################

#  Add route to return dataset
@app.route("/api/stocks")
def stocks():

    #query data for all stocks
    allData = data.find({})

    #create dictionary
    results = {}

    # loop through stocks and add to dictionary with ticker as key
    for d in allData:
        
        d.pop("_id")

        print(d["Meta Data"]["2 Symbol"])
        ticker = d["Meta Data"]["2 Symbol"]

        results[ticker] = d
    

    #jsonify and return
    return jsonify(results)

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=False)