
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import json
import csv
import time


def setup():
    chromeOptions = Options()
    chromeOptions.add_argument('--no-sandbox')
    chromeOptions.add_argument('--disable-dev-shm-usage')
    return webdriver.Chrome(options=chromeOptions)


def extractCourseFromPopup(driver):
    wait = WebDriverWait(driver, 10)
    popup = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "fsDialogContent")))

    popupHtml = popup.get_attribute('innerHTML')
    soup = BeautifulSoup(popupHtml, 'html.parser')

    bodyDiv = soup.find('div', class_='fsBody')
    description = bodyDiv.get_text(separator='\n', strip=True) if bodyDiv else ""

    credit = ""
    prerequisite = ""
    descriptionLines = []

    for line in description.split('\n'):
        line = line.strip()
        if not line:
            continue

        lineLower = line.lower()

        if 'credit' in lineLower:
            credit = line
        elif 'prerequisite' in lineLower or 'prereq' in lineLower:
            prerequisite = line
        else:
            descriptionLines.append(line)

    finalDescription = '\n'.join(descriptionLines).strip() if (credit or prerequisite) else description

    return finalDescription, credit, prerequisite


def close(driver):
    driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.ESCAPE)
    time.sleep(0.3)


def scrape(url="https://www.nmhschool.org/academics/curriculum/curriculum-guide"):
    driver = setup()

    driver.get(url)
    time.sleep(3)

    articles = driver.find_elements(By.CSS_SELECTOR, "article.fsBoard-208")
    totalCourses = len(articles)

    courses = []

    for i in range(totalCourses):
        articles = driver.find_elements(By.CSS_SELECTOR, "article.fsBoard-208")
        article = articles[i]

        nameElement = article.find_element(By.CLASS_NAME, "fsTitle")
        name = nameElement.text.strip()

        readMore = article.find_element(By.CLASS_NAME, "fsReadMoreLink")
        driver.execute_script("arguments[0].scrollIntoView(true);", readMore)
        time.sleep(0.2)

        readMore.click()
        time.sleep(1)

        description, credit, prerequisite = extractCourseFromPopup(driver)

        courses.append({
            'name': name,
            'description': description,
            'credit': credit,
            'prerequisite': prerequisite
        })

        close(driver)
        time.sleep(0.3)

    driver.quit()
    return courses


def save(courses, filename='nmh_courses.csv'):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'description', 'credit', 'prerequisite'])
        writer.writeheader()
        writer.writerows(courses)


if __name__ == "__main__":
    courses = scrape()
    save(courses)