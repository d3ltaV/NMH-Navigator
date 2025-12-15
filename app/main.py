from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_assets import Environment, Bundle
import json
from dotenv import load_dotenv
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests

from database.user import User
from database.db import init_db
from database.review import Review

import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
load_dotenv()
from utils.workjobs import WORKJOBS
from utils.classes import CLASSES #format: list of [Class objects]
from utils.cocurriculars import COCURRICULARS #format: list of [Cocurricular objects]

BUILDINGS = ["Bolger", "Alumni Hall", "Schauffler Library", "Gym", "Gilder", "Various Locations", "RAC",
             "Health Center", "Communications Office", "Early Childhood Center", "Farm", "Service Learning",
             "Plant Facilities", "BEV"]
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"


app = Flask(__name__)

app.secret_key = os.environ.get("CLIENT_ID", None)
login_manager = LoginManager()
login_manager.init_app(app)
client = WebApplicationClient(GOOGLE_CLIENT_ID)

assets = Environment(app)
assets.url = app.static_url_path
assets.directory = app.static_folder
assets.debug = True
assets.auto_build = True

scss_all = Bundle(
    'scss/index.scss',
    'scss/base.scss',
    'scss/classes.scss',
    'scss/workjobs.scss',
    'scss/map.scss',
    'scss/cocurriculars.scss',
    'scss/reference.scss',
    'scss/login.scss',
    filters='libsass',
    output='css/compiled.css'
)
assets.register('scss_all', scss_all)

with app.app_context():
    #pass
    init_db()

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


@app.route('/')
def home():
    if not current_user.is_authenticated:
        return redirect(url_for('loginPage'))
    return render_template("index.html")

@app.route("/cocurriculars")
def cocurricular_view():
    return render_template("cocurriculars.html")

@app.route("/workjobs")
def workjob_view():
    return render_template("workjobs.html", buildings=BUILDINGS)


@app.route("/classes")
def class_view():
    return render_template("classes.html")

@app.route("/api/search")
def api_search():
    query = request.args.get('q', '').lower().strip()
    searchType = request.args.get('s', '').lower().strip()

    if searchType == 'workjobs':
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

    elif searchType == 'classes':
        if not query:
            all_classes = []
            for c in CLASSES:
                all_classes.append(c.to_dict())
            return jsonify(all_classes)

        results = []
        for c in CLASSES:
            class_dict = c.to_dict()
            searchable_text = f"{class_dict.get('bnc', '')} {class_dict.get('name', '')} {class_dict.get('semester', '')} {class_dict.get('room', '')}".lower()
            if query in searchable_text:
                results.append(class_dict)
        return jsonify(results)

    elif (searchType == 'cocurriculars'):
        if not query:
            all_co = []
            for co in COCURRICULARS:
                all_co.append(co.to_dict())
            return jsonify(all_co) # list of dictionary of all cocurriculars

        results = []
        for co in COCURRICULARS:
            # for x in co: add this loop if cocurriculars become grouped like workjobs
            co_dict = co.to_dict()
            searchable_text = f"{co_dict.get('name', '')} {co_dict.get('category', '')} {co_dict.get('season', '')} {co_dict.get('prerequisites', '')} {co_dict.get('location', '')} {co_dict.get('schedule', '')} {co_dict.get('advisor', '')}".lower()

            if query in searchable_text:
                results.append(co_dict)
        return jsonify(results)
    else:
        return jsonify({"error": "somethings broken"}), 400


@app.route("/map")
def map():
    load_dotenv()
    key = os.getenv('API')
    return render_template("map.html", api=key)


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

@app.route("/api/reviews/<target_type>/<target_name>")
def getReviews(target_type, target_name):
    reviews = Review.target_review(target_type, target_name)
    review_list = [
        {
            "id": r.id,
            "user_id": r.user_id,
            "target_type": r.target_type,
            "target_name": r.target_name,
            "review": r.review,
            "rating": r.rating,
            "created_at": r.created_at
        }
        for r in reviews
    ]
    return jsonify(review_list)

@app.route("/api/reviews", methods=["POST"])
@login_required
def addReview():
    data = request.json
    target_type = data.get("target_type")
    target_name = data.get("target_name")
    review_text = data.get("review")
    rating = data.get("rating")

    Review.create(
        user_id=current_user.id,
        target_type=target_type,
        target_name=target_name,
        review=review_text,
        rating=rating
    )
    return jsonify({"success": True}), 201

@app.route("/loginpage")
def loginPage():
    return render_template("login.html")

@app.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@app.route("/login/callback")
def callback():
    code = request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=url_for("callback", _external=True),
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )
    client.parse_request_body_response(json.dumps(token_response.json()))
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    user = User(id_=unique_id, name=users_name, email=users_email, profile_pic=picture)

    if not User.get(unique_id):
        User.create(unique_id, users_name, users_email, picture)

    login_user(user)
    print(f"name {user.name}, id {user.id}, email {user.email}")
    return redirect(url_for("home"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))

@app.route("/resources")
def resources():
    return render_template("reference.html")

if __name__ == "__main__":
    app.run(debug=True)