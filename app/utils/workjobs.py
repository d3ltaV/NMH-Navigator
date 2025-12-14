import pandas as pd
from dotenv import load_dotenv
import os

class WorkJobList:

    def __init__(self, name, location, supervisor, supervisor_email,
                 spots, blocks, selected_or_assigned, description, notes):
        self.name = name
        self.location = location
        self.supervisor = supervisor
        self.supervisor_email = supervisor_email
        self.spots = spots
        self.blocks = blocks
        self.selected_or_assigned = selected_or_assigned
        self.description = description
        self.notes = notes

    def to_dict(self):
        return {
            "name": self.name,
            "location": self.location,
            "supervisor": self.supervisor,
            "supervisor_email": self.supervisor_email,
            "spots": self.spots,
            "blocks": self.blocks,
            "selected_or_assigned": self.selected_or_assigned,
            "description": self.description,
            "notes": self.notes
        }
    
    @classmethod
    def getTable(cls):
        load_dotenv()
        docs = os.getenv('WORKJOB_URL')
        table = pd.read_csv(docs)
        return table

    @classmethod
    def getWorkjobs(cls):
        table = cls.getTable()
        workjobs = []
        for i, r in table.iterrows():
            job = cls(
                name=r["Workjob Name"] if pd.notna(r["Workjob Name"]) else None,
                location=r["Location"] if pd.notna(r["Location"]) else None,
                supervisor=r["Supervisor"] if pd.notna(r["Supervisor"]) else None,
                supervisor_email=r["Supervisor Email"] if pd.notna(r["Supervisor Email"]) else None,
                spots=r["Spots"] if pd.notna(r["Spots"]) else None,
                blocks=r["Blocks (if availiable)"] if pd.notna(r["Blocks (if availiable)"]) else None,
                selected_or_assigned=r["Selected/Assigned"] if pd.notna(r["Selected/Assigned"]) else None,
                description=r["Description"] if pd.notna(r["Description"]) else None,
                notes=r["Notes"] if pd.notna(r["Notes"]) else None
            )

            workjobs.append(job)

        return workjobs

    @staticmethod
    def sortByLocation(workjobs):
        sorted_workjobs = {}
        for wj in workjobs:
            loc = wj.location
            if loc not in sorted_workjobs:
                sorted_workjobs[loc] = []
            sorted_workjobs[loc].append(wj)
        return sorted_workjobs

    @staticmethod
    def printWorkjobs():
        wj = WorkJobList.getWorkjobs()
        workjobs = WorkJobList.sortByLocation(wj)
        print("Workjobs by Location:")
        for location, jobs in workjobs.items():
            print(f"----------------{location}----------------")
            for job in jobs:
                print(job.to_dict())


wj = WorkJobList.getWorkjobs()
WORKJOBS = WorkJobList.sortByLocation(wj)