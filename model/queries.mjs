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

export function insertNewEpiskeptis(ilikia, onomateponymo, email, tilefono, eidiki_katigoria) {
    const stmt = sql.prepare("INSERT INTO EPISKEPTIS (ilikia,onomateponymo,email,tilefono,eidiki_katigoria) VALUES (?,?,?,?,?)");
    try {
        stmt.run(ilikia, onomateponymo, email, tilefono, eidiki_katigoria);
        return true;
    }
    catch (e) {
        throw (e);
    }
}