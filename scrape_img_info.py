import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
import pandas as pd
import numpy as np


def main():
    driver = webdriver.Chrome()
    driver.get(f"https://www.vangoghmuseum.nl/en/collection/s0005V1962")
    soup = BeautifulSoup(driver.page_source, "lxml")

    description = soup.select_one(
        "section.art-object-page-content-section div.markdown p"
    )
    if description is not None:
        description = description.text.strip()
        print(description)
    else:
        description = "No description available"

    list = soup.find("p", class_="art-object-page-content-creator-info")
    if list is not None:
        list = list.text.split(", ")
        artist = list[0]
        artist = artist.split("(")[0].strip()
        date = list[-1]
        date = date.strip()
    else:
        artist = "No artist available"
        date = "No date available"

    list1 = soup.find("p", class_="art-object-page-content-details")
    if list1 is not None:
        list1 = list1.text.split(", ")
        dimensions = list1[0]
        art_type = list1[-1]
    else:
        dimensions = "No dimensions available"
        art_type = "No art type available"

    driver.quit()


if __name__ == "__main__":
    main()
