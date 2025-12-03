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
       load_dotenv()
       docs = os.getenv('CLASS_URL')
       if not docs:
           print("NO CLASS_URL.")
           return pd.DataFrame(columns=["BNC Code", "Course Name", "Semester", "Room"])
       try:
           table = pd.read_csv(docs)
           table.columns = table.columns.str.strip()  # Clean up column names
           return table
       except Exception as e:
           print(f"Error loading CLASS_URL: {e}")
           return pd.DataFrame(columns=["BNC Code", "Course Name", "Semester", "Room"])


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