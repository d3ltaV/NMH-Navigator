from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
from dotenv import load_dotenv
import os
from utils.workjob import WORKJOBS

app = Flask(__name__)


# Routes


BUILDINGS = ["Bolger", "Alumni Hall", "Schauffler Library", "Gym", "Gilder", "Various Locations", "RAC", "Health Center", "Communications Office", "Early Childhood Center", "Farm", "Service Learning", "Plant Facilities", "BEV"]
@app.route('/')
def home():
    return redirect(url_for("map"))

@app.route("/building")
def building():
    #maybe we can show list of all buildings in the non map view?
    pass

@app.route("/map")
def map():
    load_dotenv()
    key = os.getenv('API')
    return render_template("map.html", api=key )

@app.route("/api/workjobs/<location>")
def api_workjobs(location):
    loc = location.lower().strip()
    print(f"Searching for location: '{loc}'")
    print(f"Available keys: {list(WORKJOBS.keys())}")

    for key, jobs in WORKJOBS.items():
        if key.lower().strip() == loc:
            print(f"Found match: {key}")
            print(jobs)
            return jsonify(jobs)

    print(f"No match found for: '{loc}'")
    return jsonify({"error": "No workjobs found"}), 404


if __name__ == "__main__":
    app.run(debug=True)