import pandas as pd
from dotenv import load_dotenv
import os


class ClassList:

    def __init__(self, bnc, name, semester, room):
        self.bnc = bnc
        self.name = name
        self.semester = semester
        self.room = room


    def to_dict(self):
        return {
            "name": self.name,
            "room": self.room,
            "semester": self.semester,
            "bnc": self.bnc,
        }


    @classmethod
    def getTable(cls):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(base_dir, "../data/workjobs.csv")
        csv_path = os.path.normpath(csv_path)
        return table

    @classmethod
    def getClasses(cls):
        table = cls.getTable()
        classes = []
        for i, r in table.iterrows():
            if r["BNC Code"] == "BNC Code" or r["Course Name"] == "Course Name":
                continue
            class_obj = cls(
                bnc=r["BNC Code"] if pd.notna(r["BNC Code"]) else None,
                name=r["Course Name"] if pd.notna(r["Course Name"]) else None,
                semester=r["Semester"] if pd.notna(r["Semester"]) else None,
                room=r["Room"] if pd.notna(r["Room"]) else None
            )

            classes.append(class_obj)

        return classes
    @classmethod
    def printClasses(cls):
        classes = ClassList.getClasses()
        for c in classes:
            print(c.to_dict())


CLASSES = ClassList.getClasses()