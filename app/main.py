from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_assets import Environment, Bundle
import json
from dotenv import load_dotenv
import os
from utils.workjobs import WORKJOBS #format: dict of {location: -> [WorkJob objects]}
from utils.classes import CLASSES #format: list of [Class objects]

BUILDINGS = ["Bolger", "Alumni Hall", "Schauffler Library", "Gym", "Gilder", "Various Locations", "RAC", "Health Center", "Communications Office", "Early Childhood Center", "Farm", "Service Learning", "Plant Facilities", "BEV"]

app = Flask(__name__)

assets = Environment(app)
assets.url = app.static_url_path
assets.directory = app.static_folder

scss_all = Bundle(
    'scss/base.scss',
    'scss/classes.scss',
    'scss/workjobs.scss',
    'scss/map.scss',
    filters='libsass',
    output='css/compiled.css'
)
assets.register('scss_all', scss_all)


# Routes
@app.route('/')
def home():
    return render_template("index.html")

@app.route("/workjobs")
def workjob_view():
    return render_template("workjobs.html", buildings=BUILDINGS)

@app.route("/classes")
def class_view():
    return render_template("classes.html")

@app.route("/api/search")
def api_search():
    # query parameters
    query = request.args.get('q', '').lower().strip()
    searchType = request.args.get('s', '').lower().strip()

    if (searchType == 'workjobs'):
        if not query:
            all_jobs = []
            for jobs in WORKJOBS.values():
                all_jobs.extend([job.to_dict() for job in jobs]) # list of dictionary of all workjobs
            return jsonify(all_jobs)

        results = []
        for jobs in WORKJOBS.values():
            for job in jobs:
                job_dict = job.to_dict()
                searchable_text = f"{job_dict.get('name', '')} {job_dict.get('location', '')} {job_dict.get('description', '')} {job_dict.get('supervisor', '')}".lower()

                if query in searchable_text:
                    results.append(job_dict)
        return jsonify(results)
    
    elif (searchType == 'classes'):
        if not query:
            all_classes = []
            for c in CLASSES:
                all_classes.append(c.to_dict())
            return jsonify(all_classes) # list of dictionary of all classes

        results = []
        for c in CLASSES:
            # for x in c: add this loop if classes become grouped like workjobs
            class_dict = c.to_dict()
            searchable_text = f"{class_dict.get('bnc', '')} {class_dict.get('name', '')} {class_dict.get('semester', '')} {class_dict.get('room', '')}".lower()

            if query in searchable_text:
                results.append(class_dict)
        return jsonify(results)
    else:
        return jsonify({"error": "somethings broken"}), 400
    
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