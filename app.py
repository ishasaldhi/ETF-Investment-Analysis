# Import the dependencies.
import sqlalchemy 
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask import render_template

from datetime import datetime, date, time
from dateutil.relativedelta import relativedelta
from pymongo import MongoClient

#################################################
# Database Setup
#################################################

# reflect an existing database into a new model
#Base = automap_base()
# reflect the tables
#Base.prepare(autoload_wit  = engine)

# Save references to each table
#Measurements = Base.classes.measurements
#Stations = Base.classes.measurements

# Create our session (link) from Python to the DB
#session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

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


    # Remove the id field from the database
    #for item in allData:
    #    print(item["_id"])

    #create dictionary
    results = {}

    #TODO loop through stocks and add to dictionary with ticker as key
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