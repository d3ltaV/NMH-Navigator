import pandas as pd
from dotenv import load_dotenv
import os

def getWorkJobs():
    load_dotenv()
    docs = os.getenv('WORKJOB_URL')
    table = pd.read_csv(docs) 

    workjobs = []
    for i, r in table.iterrows():
        job = {
            "name": r["Workjob Name"],
            "location": r["Location"],
            "supervisor": r["Supervisor"],
            "supervisor_email": r["Supervisor Email"],
            "spots": r["Spots"],
            "blocks": r["Blocks (if availiable)"],
            "selected_or_assigned": r["Selected/Assigned"],
            "description": r["Description"],
            "notes": r["Notes"]
        }
        workjobs.append(job)
    return workjobs

# d = getWorkJobs()
# print(d)