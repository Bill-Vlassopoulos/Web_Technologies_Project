import sqlite3
import pandas as pd


def main():
    conn = sqlite3.connect("model/ArtGallery.db")
    cursor = conn.cursor()
    DataFrame = pd.read_csv("vangogh.csv")

    for x in range(len(DataFrame)):
        cursor.execute(
            "INSERT INTO ERGO (arithmos_ergou, link, xronologia, diastaseis,  typos_kamva, onoma, perigrafi, kallitexnis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                DataFrame["Art_ID"][x],
                DataFrame["Image-Link"][x],
                DataFrame["Date"][x],
                DataFrame["Dimensions"][x],
                DataFrame["Art Type"][x],
                DataFrame["Title"][x],
                DataFrame["Description"][x],
                DataFrame["Artist"][x],
            ),
        )
        conn.commit()

    conn.close()


if __name__ == "__main__":
    main()
