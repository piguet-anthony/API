/* eslint-disable no-console */
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (errConnect) => {
    if (errConnect) {
        // Cannot open database
        console.error(errConnect.message);
        throw errConnect;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE genres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name varchar(255) NOT NULL
            );`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insertGenre = 'INSERT INTO genres (name) VALUES (?)';
                    db.run(insertGenre, ['Action']);
                }
            },
        );

        db.run(
            `CREATE TABLE actors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name varchar(255) NOT NULL,
                last_name varchar(255) NOT NULL,
                date_of_birth date NOT NULL,
                date_of_death date
            );`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insertActors = 'INSERT INTO actors (first_name, last_name, date_of_birth, date_of_death) VALUES (?,?,?,?)';
                    db.run(insertActors, ['Jean','Dujardin','1972-07-19',null]);
                    db.run(insertActors, ['Tom', 'Cruise', '1962-07-03', null]);
                }
            },
        );

        db.run(
            `CREATE TABLE films (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name varchar(255) NOT NULL,
                synopsis text NOT NULL,
                release_year int,
                genre_id int NOT NULL
            );`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insertFilms = 'INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?,?,?,?)';
                    db.run(insertFilms, ['OSS117','Agent Secret','','1']);
                    db.run(insertFilms, ['Top Gun', 'Y a des gros avions c\'est beau', '2022', 1]);
                }
            },
        );

        db.run(
            `CREATE TABLE films_actors (
                film_id INTEGER,
                actor_id INTEGER,
                FOREIGN KEY (film_id) REFERENCES films(id),
                FOREIGN KEY (actor_id) REFERENCES actors(id),
                PRIMARY KEY (film_id, actor_id)
            );`,
            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insertFilms_actors = 'INSERT INTO films_actors (film_id, actor_id) VALUES (?,?)';
                    db.run(insertFilms_actors, ['1','1']);
                    db.run(insertFilms_actors, ['2','2']);
                }
            },
        );
    }
});

module.exports = db;