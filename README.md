
# CMP521 NMH Navigator Capstone Project 

**Sprint Duration:** November 10–15, 2025  
**Team Members:** Grace Huang, Joelle Yang, Lorcan Purcell, Siddiqi Komou, Loli Koko, Angelina Marakaeva 

**Project Owner:** Kevin Santos  
**Framework:** Flask (Python 3.10+)

---

## 1. Project Overview

The **NMH Navigator** is a Flask-based web app that helps students discover and review **Workjob, Classes, Co-Curricular/PEs** options on campus in one place. The MVP includes an **interactive campus map**, **catalog list views**, a **rating and review system**, **resources page**, and **global search/filter sort**. 

The system:
- Stores workjob, classes, PE, and co-curricular information in a **CSV file**
- Allows for NMH user **registration**, **login**, and **logout** (required for posting reviews, only accessible to NMH students)
- Enables NMH users to post anonymous reviews about workjob, classes, PE, and co-curricular information
- Provides functionality for product owners and design team to check reviews posted to make sure they’re appropriate
- Offers **interactive map view** (pins for locations that open detailed information)
- Contains a **resources page** with links to all official NMH resources
- Offers a **catalog view** with **search**, **filters**, and **sorting**

---

## 2. File Structure (will change once more features are added)

<pre>NMH-Navigator/
│
├── app/
│   ├── database/                         # Database models and handlers
│   │   ├── db.py
│   │   ├── review.py
│   │   └── user.py
│   │
│   ├── static/                           # Front-end assets
│   │   ├── scss/                         # Stylesheets
│   │   │   ├── base.scss
│   │   │   ├── classes.scss
│   │   │   ├── index.scss
│   │   │   ├── map.scss
│   │   │   ├── styles.scss
│   │   │   └── workjobs.scss
│   │   │
│   │   ├── js/                           # Front-end scripts
│   │   │   ├── base.js                   # Global JS helpers
│   │   │   ├── classes.js
│   │   │   ├── map.js
│   │   │   └── workjobs.js
│   │   │
│   │   └── images/                       # Icons, map assets, UI images
│   │
│   ├── templates/                       # HTML templates
│   │   ├── base.html                    # Base layout template
│   │   ├── index.html                   # Home page
│   │   ├── classes.html                 # Classes page
│   │   ├── map.html                     # Interactive map view
│   │   └── workjobs.html                # Workjob page
│   │
│   ├── utils/                            # App-level backend utilities
│   │   ├── workjob.py                   # Workjob data utilities
│   │   └── workjob_class.py             # Shared class + workjob logic
│   │
│   └── __init__.py                      # Flask app factory
│
├── utils/                               # Project-wide utilities
│   ├── scraper.py                       # General data scraper/crawler
│   ├── classes.py                       # Class data processing
│   └── workjobs.py                      # Workjob data processing
│
├── main.py                              # Application entry 
│
├── docs/                               # Project documentation
│   ├── Use_Case_Diagram.jpg             # Use case diagram
│   ├── Class_Diagram.jpg                # Class attributes and methods
│   └── SRS.md                           # Software Requirements Specification Document
│
├── .env                                 # Environment variables (not tracked)
├── .gitignore                           # Git ignore rules
└── README.md                            # Project documentation & How to Run </pre>



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
- List view: department, level, prereqs, etc.
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

### Resources Page
- Information Sections: General NMH Information, NMH Academics, NMH Athletics, NMH Student Life
- Links and directories to existing NMH resources and databases

### Search/Filter/Sort for Each Page
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
API=<google_maps_api_key>
WORKJOB_URL=<workjob_data_source>
CLASS_URL=<class_data_source>
COCURRICULAR_URL=<cocurricular_data_source>
GOOGLE_CLIENT_SECRET=<google_client_secret>
GOOGLE_CLIENT_ID<google_client_id>
CLIENT_ID=<contact developer>
```
For cases of security, each developer must create .env locally. Contact development team for more information. 

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
