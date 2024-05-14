# import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
import pandas as pd
import numpy as np


def main():
    df = pd.DataFrame(columns=["Art_ID", "Title", "Image-Link"])
    df2 = pd.DataFrame(
        columns=["Artist", "Dimensions", "Date", "Art Type", "Description"]
    )
    driver = webdriver.Chrome()

    # or webdriver.Chrome()
    driver.get("https://www.vangoghmuseum.nl/en/collection")

    for _ in range(8):  # Adjust this value based on your needs
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "lxml")
    divs = soup.find_all("div", class_="collection-art-object-list-item")

    i = 0
    for div in divs:
        # i += 1
        # print("{}) {}".format(i, div.get("aria-label")))
        a_tag = div.find("a")
        source = div.find("source")
        src = source.get("data-srcset")
        src = src.split("w,")[3].split(" ")[0]

        if a_tag is not None:
            link = a_tag.get("href")
            df2.loc[i] = scrape_image_info(link.split("/")[-1])
            df.loc[i] = [
                link.split("/")[-1],
                div.get("aria-label"),
                src,
            ]
            i += 1
    driver.quit()
    df = pd.concat([df, df2], axis=1)
    df.to_csv("vangogh.csv", index=False)


def scrape_image_info(art_id):
    driver = webdriver.Chrome()
    driver.get(f"https://www.vangoghmuseum.nl/en/collection/{art_id}")
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
        art_type = list1[0].strip()
        dimensions = list1[-1].strip()
    else:
        dimensions = "No dimensions available"
        art_type = "No art type available"

    driver.quit()
    print([artist, dimensions, date, art_type, description])
    return [artist, dimensions, date, art_type, description]


if __name__ == "__main__":
    main()
