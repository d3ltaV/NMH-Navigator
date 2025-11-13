from bs4 import BeautifulSoup
import requests


target = requests.get("https://www.nmhschool.org/academics/curriculum/curriculum-guide")
soup = BeautifulSoup(target.content, 'html.parser')


