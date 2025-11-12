from flask import Flask, render_template, request, jsonify, redirect, url_for
import json

app = Flask(__name__)


# Routes



with open('buildings.json') as f:
    BUILDINGS =  json.load(f)

@app.route('/')
def home():
    return redirect(url_for("map"))

@app.route("api/buildings")
def get_buildings():
    #data for map
    return jsonify(BUILDINGS)
@app.route("/building")
def building():
    #maybe we can show list of all buildings in the non map view?
    pass

@app.route("/map")
def map():
    #where map is shown
    return render_template("index.html")

@app.route("/buildings/<name>")
def buildings(name):
    selected_building = next((x for x in BUILDINGS if x["name"] == name), None)
    if not selected_building:
        return "no building found"
    return render_template("building.html", building=selected_building)

if __name__ == "__main__":
    app.run(debug=True)