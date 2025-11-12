from flask import *

app = Flask(__name__)


# Routes


def load_buildings():
    with open('buildings.json') as f:
        return json.load(f)

@app.route('/')
def home():
    return render_template("index.html")

@app.route("/building")
def building():
    #maybe we can show list of all buildings in the non map view?
    pass

@app.route("/map")
def map():
    # map view
    pass

@app.route("/buildings/<name>")
def buildings(name):
    buildings = load_buildings()
    selected_building = next((x for x in buildings if x["name"] == name), None)
    if not selected_building:
        return "no building found"
    return render_template("building.html", building=selected_building)

if __name__ == "__main__":
    app.run(debug=True)