import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
import pandas as pd
import numpy as np


def main():
    driver = webdriver.Chrome()
    driver.get(f"https://www.vangoghmuseum.nl/en/collection/d0386M1977")
    soup = BeautifulSoup(driver.page_source, "lxml")
    description = soup.select_one(
        "section.art-object-page-content-section div.markdown p"
    )
    if description is not None:
        description = description.text.strip()
        # print(description)
    else:
        description = "No description available"

    list = soup.select_one(
        ".art-object-page-content-section  p.art-object-page-content-creator-info"
    )
    if list is not None:
        list = list.text.split(", ")
        artist = list[0]
        artist = artist.split("(")[0].strip()
        date = list[-1]
        date = date.strip()
    else:
        artist = "No artist available"
        date = "No date available"

    list1 = soup.select_one(
        ".art-object-page-content-section p.art-object-page-content-details"
    )
    if list1 is not None:
        list1 = list1.text.split(", ")
        art_type = list1[0]
        dimensions = list1[-1]
    else:
        dimensions = "No dimensions available"
        art_type = "No art type available"

    driver.quit()
    print(artist, dimensions, date, art_type, description)


if __name__ == "__main__":
    main()
