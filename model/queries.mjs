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



