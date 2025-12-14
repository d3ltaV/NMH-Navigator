import pandas as pd
from dotenv import load_dotenv
import os


class CocurricularList:

    def __init__(self, name, category, season, prerequisites, location, schedule, advisor):
        self.name = name
        self.category = category   
        self.season = season
        self.prerequisites = prerequisites
        self.location = location
        self.schedule = schedule
        self.advisor = advisor

    def to_dict(self):
        return {
            "name": self.name,
            "category": self.category,
            "season": self.season,
            "prerequisites": self.prerequisites,
            "location": self.location,
            "schedule": self.schedule,
            "advisor": self.advisor
        }

    @classmethod
    def getTable(cls):
        load_dotenv()
        docs = os.getenv('COCURRICULAR_URL')
        table = pd.read_csv(docs)
        table.columns = table.columns.str.strip()
        return table

    @classmethod
    def getCocurriculars(cls):
        table = cls.getTable()
        cocurriculars = []
        for i, r in table.iterrows():
            if r["Name"] == "Name" or r["Category"] == "Category":
                continue
            class_obj = cls(
                name=r["Name"] if pd.notna(r["Name"]) else None,
                category=r["Category"] if pd.notna(r["Category"]) else None,
                season=r["Season"] if pd.notna(r["Season"]) else None,
                prerequisites=r["Prerequisites"] if pd.notna(r["Prerequisites"]) else None,
                location=r["Location"] if pd.notna(r["Location"]) else None,
                schedule=r["Schedule"] if pd.notna(r["Schedule"]) else None,
                advisor=r["Faculty Advisor"] if pd.notna(r["Faculty Advisor"]) else None
            )

            cocurriculars.append(class_obj)

        return cocurriculars
    @classmethod
    def printClasses(cls):
        co = CocurricularList.getCocurriculars()
        for c in co:
            print(c.to_dict())


COCURRICULARS = CocurricularList.getCocurriculars()
CocurricularList.printClasses()