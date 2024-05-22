'use strict';
import db from 'better-sqlite3'
const sql = new db('model/ArtGallery.sqlite', { fileMustExist: true });

export function getAllErga() {
    const stmt = sql.prepare("SELECT link,arithmos_ergou FROM ERGO");
    let links;
    try {
        return links = stmt.all();

    }
    catch (e) {
        throw (e);
    }
}

export function getAllErgaAllInfo() {
    const stmt = sql.prepare("SELECT * FROM ERGO");
    let links;
    try {
        return links = stmt.all();

    }
    catch (e) {
        throw (e);
    }

}

export function getErgo(arithmos_ergou) {
    const stmt = sql.prepare("SELECT * FROM ERGO WHERE arithmos_ergou = ?");
    let ergo;
    try {
        return ergo = stmt.get(arithmos_ergou);
    }
    catch (e) {
        throw (e);
    }
}

export function getErgaWithDescription() {
    const stmt = sql.prepare("SELECT * FROM ERGO WHERE perigrafi != 'No description available'");
    let erga;
    try {
        return erga = stmt.all();
    }
    catch (e) {
        throw (e);
    }
}

export function insertNewEpiskeptis(onomateponymo, email, tilefono) {
    const stmt = sql.prepare("INSERT INTO EPISKEPTIS (onomateponymo,email,tilefono) VALUES (?,?,?)");
    try {
        stmt.run(onomateponymo, email, tilefono);
        return true;
    }
    catch (e) {
        throw (e);
    }
}

export function insertNewEisitirio(imerominia, ora, eidiki_katigoria, id_episkepti) {

    if (imerominia === undefined || ora === undefined || eidiki_katigoria === undefined || id_episkepti === undefined) {
        throw new Error('All parameters must be defined');
    }
    // Convert imerominia to a Date object
    const date = new Date(imerominia);

    // Format the date as YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const stmt = sql.prepare("INSERT INTO EISITIRIO (imerominia,ora,eidiki_katigoria,id_episkepti) VALUES (?,?,?,?)");



    try {
        stmt.run(formattedDate, ora, eidiki_katigoria, id_episkepti);
        return true;
    }
    catch (e) {
        throw (e);
    }
}

export function getIdofLastEpiskeptis() {
    const stmt = sql.prepare("SELECT id_episkepti FROM EPISKEPTIS ORDER BY id_episkepti DESC LIMIT 1");
    let id;
    try {
        return id = stmt.get();
    }
    catch (e) {
        throw (e);
    }
}

export function getAithouses() {
    const stmt = sql.prepare("SELECT * FROM AITHOUSA");
    let aithouses;
    try {
        return aithouses = stmt.all();
    }
    catch (e) {
        throw (e);
    }
}

export function insertNewErgo(arithmos_ergou, link, xronologia, diastaseis, typos_kamva, onoma, perigrafi, kallitexnis) {
    const stmt = sql.prepare("INSERT INTO ERGO (arithmos_ergou,link,xronologia,diastaseis,typos_kamva,onoma,perigrafi,kallitexnis) VALUES (?,?,?,?,?,?,?,?)");
    try {
        stmt.run(arithmos_ergou, link, xronologia, diastaseis, typos_kamva, onoma, perigrafi, kallitexnis);
        return true;
    }
    catch (e) {
        throw (e);
    }
}

export function deleteErgo(arithmos_ergou) {
    const stmt = sql.prepare("DELETE FROM ERGO WHERE arithmos_ergou = ?");
    try {
        stmt.run(arithmos_ergou);
        return true;
    }
    catch (e) {
        throw (e);
    }

}

export function newPeriodikiEkthesi(titlos, perigrafi, imerominia_enarxis, imerominia_lixis, id_aithousas) {
    const stmt = sql.prepare("INSERT INTO EKTHESI (onoma_ekthesis,perigrafi) VALUES (?,?)");

    try {
        stmt.run(titlos, perigrafi);
        const stmt2 = sql.prepare("SELECT id_ekthesis FROM EKTHESI ORDER BY id_ekthesis DESC LIMIT 1");
        let id;
        try {
            id = stmt2.get();
            const stmt3 = sql.prepare("INSERT INTO PARODIKI_EKTHESI (id_ekthesis,imerominia_enarxis,imerominia_lixis) VALUES (?,?,?)");
            stmt3.run(id.id_ekthesis, imerominia_enarxis, imerominia_lixis);
            try {
                const stmt4 = sql.prepare("INSERT INTO DIEXAGETAI (id_ekthesis,id_aithousas) VALUES (?,?)");
                stmt4.run(id.id_ekthesis, parseInt(id_aithousas));
                return true;
            }
            catch (e) {
                throw (e);
            }

        }
        catch (e) {
            throw (e);
        }
    }
    catch (e) {
        throw (e);
    }


};

export function checkAvailableAithouses(imerominia_enarxis, imerominia_lixis) {
    const stmt = sql.prepare(`SELECT DISTINCT(DIEXAGETAI.id_aithousas)
    FROM DIEXAGETAI
    WHERE id_aithousas NOT IN(
            SELECT DIEXAGETAI.id_aithousas
            FROM DIEXAGETAI
            JOIN PARODIKI_EKTHESI ON DIEXAGETAI.id_ekthesis=PARODIKI_EKTHESI.id_ekthesis
            WHERE (imerominia_enarxis <= ? AND  ? <=imerominia_lixis )
               OR (imerominia_enarxis <= ? AND  ? <=imerominia_lixis )
               OR (imerominia_enarxis = ? AND imerominia_lixis = ?)
               )`);
    let available;
    try {
        return available = stmt.all(imerominia_enarxis, imerominia_enarxis, imerominia_lixis, imerominia_lixis, imerominia_enarxis, imerominia_lixis);
    }
    catch (e) {
        throw (e);
    }
}

export function getActiveFutureExhibitions() {
    const stmt = sql.prepare(`SELECT * 
            FROM PARODIKI_EKTHESI
            JOIN EKTHESI ON PARODIKI_EKTHESI.id_ekthesis = EKTHESI.id_ekthesis
            WHERE PARODIKI_EKTHESI.imerominia_lixis >= CURRENT_DATE`);
    let ektheseis;
    try {
        return ektheseis = stmt.all();
    }
    catch (e) {
        throw (e);
    }
}

export function availableErga(imerominia_enarxis, imerominia_lixis) {
    const stmt = sql.prepare(`SELECT *
    FROM ERGO
    WHERE ERGO.arithmos_ergou NOT IN (
        SELECT PERILAMBANETAI.arithmos_ergou
        FROM PERILAMBANETAI
        WHERE (imerominia_enarxsis <= ? AND  ? <=imerominia_lixis )
               OR (imerominia_enarxsis <= ? AND  ? <=imerominia_lixis )
               OR (imerominia_enarxsis = ? AND imerominia_lixis = ?)
    );`);
    let available;
    try {
        return available = stmt.all(imerominia_enarxis, imerominia_enarxis, imerominia_lixis, imerominia_lixis, imerominia_enarxis, imerominia_lixis);
    }
    catch (e) {
        throw (e);
    }
}

export function insertErgotoEkthesi(arithmos_ergou, id_ekthesis, imer_enarx, imer_liksis) {
    const stmt = sql.prepare("INSERT INTO PERILAMBANETAI (arithmos_ergou,id_ekthesis,imerominia_enarxsis,imerominia_lixis) VALUES (?,?,?,?)");
    try {
        stmt.run(arithmos_ergou, id_ekthesis, imer_enarx, imer_liksis);
        return true;
    }
    catch (e) {
        throw (e);
    }
}

export function getIdofLastEkthesis() {
    const stmt = sql.prepare("SELECT id_ekthesis FROM EKTHESI ORDER BY id_ekthesis DESC LIMIT 1");
    let id;
    try {
        return id = stmt.get();
    }
    catch (e) {
        throw (e);
    }
}



