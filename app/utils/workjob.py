import pandas as pd
from dotenv import load_dotenv
import os


def getWorkJobs():
    load_dotenv()
    docs = os.getenv('WORKJOB_URL')
    table = pd.read_csv(docs)

    workjobs = {}
    for i, r in table.iterrows():
        job = {
            "name": r["Workjob Name"] if pd.notna(r["Workjob Name"]) else None,
            "location": r["Location"] if pd.notna(r["Location"]) else None,
            "supervisor": r["Supervisor"] if pd.notna(r["Supervisor"]) else None,
            "supervisor_email": r["Supervisor Email"] if pd.notna(r["Supervisor Email"]) else None,
            "spots": r["Spots"] if pd.notna(r["Spots"]) else None,
            "blocks": r["Blocks (if availiable)"] if pd.notna(r["Blocks (if availiable)"]) else None,
            "selected_or_assigned": r["Selected/Assigned"] if pd.notna(r["Selected/Assigned"]) else None,
            "description": r["Description"] if pd.notna(r["Description"]) else None,
            "notes": r["Notes"] if pd.notna(r["Notes"]) else None
        }
        loc = r["Location"]

        if loc not in workjobs:
            workjobs[loc] = []

        workjobs[loc].append(job)

    return workjobs


WORKJOBS = getWorkJobs()