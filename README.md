
# CMP521 NMH Navigator Capstone Project 

**Sprint Duration:** November 10–15, 2025  
**Team Members:** Grace Huang, Joelle Yang, Lorcan Purcell, Siddiqi Komou, Loli Koko, Angelina Marakaeva 
**Project Owner:** Kevin Santos  
**Framework:** Flask (Python 3.10+)

---

## 1. Project Overview

The **NMH Navigator** is a Flask-based web app that helps students discover and review **Workjob, Classes, Co-Curricular/PEs** options on campus in one place. The MVP includes a **interactive campus map**, **catalog list views**, a **rating and review system**, and **global search/filter sort**. 

The system:
- Stores workjob, classes, PE, and co-curricular information in a **CSV file**
- Allows for NMH user **registration**, **login**, and **logout** (required for posting reviews, only accessible to NMH students)
- Enables NMH users to post anonymous reviews about workjob, classes, PE, and co-curricular information
- Provides functionality for product owners and design team to check reviews posted to make sure they’re appropriate
- Offers **interactive map view** (pins for locations that open detailed information)
- Offers a **catalog view** with **search**, **filters**, and **sorting**

---

## 2. File Structure (will change once more features are added)

<pre>'''NMH-Navigator/
│
├── app/
│   ├── static/                        # Front-end 
│   │   ├── css/                       # Stylesheets
│   │   ├── images/                    # Icons, map assets, UI images
│   │   ├── js/                        # Front-end scripts
│   │   └── base.js                    # Global JS helpers
│   │
│   ├── templates/                     # HTML templates
│   │   ├── base.html                  # Layout template
│   │   ├── index.html                 # Home page
│   │   └── map.html                   # Interactive map view
│   │
│   ├── utils/                         # App-level backend utilities
│   │   ├── workjob.py                 # Workjob data utilities
│   │   └── workjob_class.py           # Class + workjob shared utilities
│   │
│   └── __init__.py                    # Flask app factory
│
├── utils/                             # Project-wide utilities
│   └── scraper.py                     # Data scraper/crawler
│
├── docs/                              # Project documentation
│   └── Use_Case_Diagram.jpg #Documents the use case of the program
│   └── Class_Diagram.jpg    #Documents the attributes and methods for each class
│   └── SRS.md               # Full SRS (Purpose, Scope, Constraints, Stories)
│
├── .env                     # Environment installations (not on Github)
│
├── .gitignore                         # Git ignore rules
│
└── README.md                          # Documentation '''</pre>



---

## 3. Feature Overview (more updated once whole file structure is finished)

### Authentication
- Registers new users (email and password)
- Validate login credentials and secure logout
- Login required to submit and view reviews/feedback

### Interactive Map
- Pins for campus locations with classes/workjobs
- Clicking a pin opens detailed panel with linked lists

### Class Catalog
- List view: department, level, prerqs, etc.
- Filters: department, level, location
- Ratings and reviews

### Workjob Catalog
- List all workjobs: title, description, hours/terms, location, supervisor/contact, prereqs/skills
- Filters: hours/term, location, day
- Mailto links for supervisor/contact
- Ratings & reviews panel

### Cocurricular/PE Catalog
- List view: names, category, meeting times, terms, advisor, description
- Filters: location, season offered, etc.
- NMH users able to access ratings and reviews

### Rating & Review System
- Only accessible to NMH users
- 0–5 rating scale and any string comments

### Global Search/Filter/Sort
- Search across Workjobs, Classes, and PE/Co-Curriculars
- Sort by name, rating, or availability
- Can be viewed both via a toggle list and a map
---

## 4. Diagrams and Documentation

**docs/** includes:
- **Use Case Diagram:** Player actions 
- **Class Diagram:** Displays methods and attributes for the program’s classes
- **SRS Document:** Outlines project scope, constraints, and user stories

---

## 5. How to Run the App

Follow these steps to run **NMH Navigator** on your local machine.

### 1. Clone the Repository
```bash
git clone git@github.com:d3ltaV/NMH-Navigator.git
cd NMH-Navigator
```

### 2. Create & Activate a Virtual Environment
```bash
Mac / Linux:
python3 -m venv venv
source venv/bin/activate

Windows (PowerShell):
python -m venv venv
venv\Scripts\activate
```

### 3. Install Required Packages
```bash
pip install -r requirements.txt
```
### 4. Add Your .env File
In the root folder, create a .env file containing:
```bash
WORKJOB_URL=<https://docs.google.com/spreadsheets/d/e/2PACX-1vTR6OP1q_w4LObL3liuHMsMWG5Eq_b38LuaHDu4JnTpIBbBEtnn-yV9JEgriquvzS_uL4PcJ0yxpdWg/pub?gid=0&single=true&output=csv>
CLASS_URL=<https://docs.google.com/spreadsheets/d/e/2PACX-1vQrzYHWyCQR6cYvgSI6coAbcQh2fZOyBbsSYuhaJI6jSUE5MVpb-y6uALcV6Q3a1McEMErrBKofJump/pub?gid=0&single=true&output=csv>
API=<API=AIzaSyBdNCKFoAmB0Xutb3b0lri5ZK45f7V0xqM>
```
For cases of security, each developer must create .env locally.

### 5. Run the App
```bash
python app/main.py
```
Users should see something similar to:
```bash
* Running on http://127.0.0.1:5000/
```
Works in both port 5000 and others ports as well. 

### 6. Open the App in Your Browser
Visit:
http://127.0.0.1:5000
(Or adjust to specific port)
