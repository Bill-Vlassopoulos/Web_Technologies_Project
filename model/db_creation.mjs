import sqlite3 from 'sqlite3';


const db = new sqlite3.Database('./model/ArtGallery.sqlite');

// Create a table named 'Artists' with columns 'id', 'name', 'birth_year', 'country'

// Create a table named 'EPISKEPTIS' with columns 'id_episkepti', 'ilikia', 'onomateponymo', 'email','tilefono','eidiki_katigoria'


let tables = [`CREATE TABLE EPISKEPTIS (
        id_episkepti INTEGER PRIMARY KEY AUTOINCREMENT,
        onomateponymo TEXT,
        email TEXT,
        tilefono TEXT
        
);`,
    `CREATE TABLE EKTHESI (
        id_ekthesis INTEGER PRIMARY KEY AUTOINCREMENT,
        onoma_ekthesis CHAR(50),
        perigrafi TEXT
);`,

    `CREATE TABLE EISITIRIO (
        id_eisitiriou INTEGER PRIMARY KEY AUTOINCREMENT,
        imerominia DATE,
        ora CHAR(10),
        eidiki_katigoria CHAR(20),
        id_episkepti INTEGER,
        FOREIGN KEY (id_episkepti) REFERENCES EPISKEPTIS(id_episkepti)
        
    );`,
    `CREATE TABLE ANTISTOIXEI (
        id_eisitiriou INTEGER,
        id_ekthesis INTEGER,
        FOREIGN KEY (id_eisitiriou) REFERENCES EISITIRIO(id_eisitiriou),
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis)
    );`,

    `CREATE TABLE MONIMI_EKTHESI (
        id_ekthesis INTEGER PRIMARY KEY ,
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis)
    );`,
    `CREATE TABLE PARODIKI_EKTHESI (
        id_ekthesis INTEGER PRIMARY KEY ,
        imerominia_enarxis DATE,
        imerominia_lixis DATE,
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis)
    );`,
    `CREATE TABLE ERGO (
        arithmos_ergou CHAR(15) PRIMARY KEY,
        link TEXT,
        xronologia CHAR(20),
        diastaseis CHAR(20),
        typos_kamva CHAR(20),
        onoma TEXT,
        perigrafi TEXT,
        kallitexnis TEXT
    );`,
    `CREATE TABLE MONIMO_ERGO (
        arithmos_ergou INTEGER PRIMARY KEY,
        daneismos BOOLEAN,
        id_ekthesis INTEGER,
        FOREIGN KEY (arithmos_ergou) REFERENCES ERGO(arithmos_ergou),
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis)
     );`,
    `CREATE TABLE PROSORINO_ERGO (
        arithmos_ergou INTEGER PRIMARY KEY,
        pinakothiki_proelefsis CHAR(30),
        FOREIGN KEY (arithmos_ergou) REFERENCES ERGO(arithmos_ergou)
    );`,
    `CREATE TABLE AITHOUSA (
        id_aithousas INTEGER PRIMARY KEY,
        orio_atomon INTEGER
    );`,
    `CREATE TABLE DIEXAGETAI (
        id_ekthesis INTEGER,
        id_aithousas INTEGER,
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis),
        FOREIGN KEY (id_aithousas) REFERENCES AITHOUSA(id_aithousas)
    );`,
    `CREATE TABLE PERILAMBANETAI(
        id_ekthesis INTEGER,
        arithmos_ergou INTEGER,
        imerominia_enarxsis DATE,
        imerominia_lixis DATE,
        FOREIGN KEY (id_ekthesis) REFERENCES EKTHESI(id_ekthesis),
        FOREIGN KEY (arithmos_ergou) REFERENCES ERGO(arithmos_ergou)
    );`,
        `CREATE TABLE DIAXEIRISTIS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username CHAR(20),
        password CHAR(20)
    );`,


]


for (let table of tables) {
    db.run(table, (err) => {
        if (err) {
            console.log(err);
        }
    });
}