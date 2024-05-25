import sqlite3
import pandas as pd
import random
import bcrypt


def main():
    conn = sqlite3.connect("model/ArtGallery.sqlite")
    cursor = conn.cursor()
    DataFrame = pd.read_csv("vangogh.csv")
    DataFrame_exhibition = pd.read_csv("exhibitions.csv")
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
    cursor.execute(
        "INSERT INTO EKTHESI (onoma_ekthesis, perigrafi) VALUES (?, ?)",
        (
            "Μόνιμη Έκθεση",
            "Η μόνιμη έκθεση της πινακοθήκης του Βαν Γκογκ",
        ),
    )
    conn.commit()
    id_ekthesis = cursor.execute(
        "SELECT id_ekthesis FROM EKTHESI WHERE onoma_ekthesis = 'Μόνιμη Έκθεση'"
    )
    id_ekthesis = id_ekthesis.fetchone()[0]
    cursor.execute(
        "INSERT INTO MONIMI_EKTHESI(id_ekthesis) VALUES (?)",
        (id_ekthesis,),
    )
    conn.commit()
    for x in range(3):
        orio = random.randint(10, 20)
        cursor.execute(
            "INSERT INTO AITHOUSA(id_aithousas,orio_atomon) VALUES (?,?)",
            (x + 1, orio),
        )
        conn.commit()
    for x in range(len(DataFrame_exhibition)):
        cursor.execute(
            "INSERT INTO EKTHESI(onoma_ekthesis, perigrafi) VALUES (?, ?)",
            (
                DataFrame_exhibition["onoma_ekthesis"][x],
                DataFrame_exhibition["perigrafi"][x],
            ),
        )
        conn.commit()
        id = cursor.execute(
            "SELECT id_ekthesis FROM EKTHESI WHERE onoma_ekthesis = ?",
            (DataFrame_exhibition["onoma_ekthesis"][x],),
        )
        id = id.fetchone()[0]
        cursor.execute(
            "INSERT INTO PARODIKI_EKTHESI(id_ekthesis,imerominia_enarxis,imerominia_lixis,link) VALUES (?, ?, ?, ?)",
            (
                id,
                DataFrame_exhibition["imerominia_enarxis"][x],
                DataFrame_exhibition["imerominia_liksis"][x],
                DataFrame_exhibition["link"][x],
            ),
        )
        conn.commit()
        cursor.execute(
            "INSERT INTO DIEXAGETAI(id_ekthesis, id_aithousas) VALUES (?, ?)",
            (id, int(DataFrame_exhibition["aithousa"][x])),
        )
        conn.commit()
    cursor.execute(
        "INSERT INTO DIAXEIRISTIS(username, password) VALUES (?, ?)",
        ("admin", bcrypt.hashpw("admin".encode("utf-8"), bcrypt.gensalt())),
    )
    conn.commit()
    for x in range(int(len(DataFrame) / 2)):
        cursor.execute(
            "INSERT INTO PERILAMBANETAI(id_ekthesis,arithmos_ergou,imerominia_enarxsis,imerominia_lixis) VALUES (?, ?, ?, ?)",
            (1, DataFrame["Art_ID"][x], None, None),
        ),

        conn.commit()
    conn.close()


if __name__ == "__main__":
    main()
