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