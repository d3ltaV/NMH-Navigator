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
    return render_template("index.html")


@app.route("/workjob")
def list_view():
    return render_template("workjob.html", buildings=BUILDINGS)


@app.route("/api/search")
def api_search():
    query = request.args.get('q', '').lower().strip()

    if not query:
        all_jobs = []
        for jobs in WORKJOBS.values():
            all_jobs.extend([job.to_dict() for job in jobs])
        return jsonify(all_jobs)

    results = []
    for jobs in WORKJOBS.values():
        for job in jobs:
            job_dict = job.to_dict()
            searchable_text = f"{job_dict.get('name', '')} {job_dict.get('location', '')} {job_dict.get('description', '')} {job_dict.get('supervisor', '')}".lower()

            if query in searchable_text:
                results.append(job_dict)

    return jsonify(results)
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
            return jsonify([job.to_dict() for job in jobs])

    print(f"No match found for: '{loc}'")
    return jsonify({"error": "No workjobs found"}), 404


if __name__ == "__main__":
    app.run(debug=True)