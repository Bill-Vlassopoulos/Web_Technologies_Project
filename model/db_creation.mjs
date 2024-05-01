import sqlite3 from 'sqlite3';


const db = new sqlite3.Database('./ArtGallery.sql');

// Create a table named 'Artists' with columns 'id', 'name', 'birth_year', 'country'
db.run();