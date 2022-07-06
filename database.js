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
            `CREATE TABLE 'genres' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL
            );`,
              
            `CREATE TABLE 'actors' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'first_name' varchar(255) NOT NULL,
                'last_name' varchar(255) NOT NULL,
                'date_of_birth' date NOT NULL,
                'date_of_death' date
            );`,
              
            `CREATE TABLE 'films' (
                'id' INTEGER PRIMARY KEY AUTOINCREMENT,
                'name' varchar(255) NOT NULL,
                'synopsis' text NOT NULL,
                'release_year' int,
                'genre_id' int NOT NULL
            );`,
              
            `CREATE TABLE 'films_actors' (
                'film_id' INTEGER,
                'actor_id' INTEGER,
                FOREIGN KEY (film_id) REFERENCES films(id),
                FOREIGN KEY (actor_id) REFERENCES actors(id),
                PRIMARY KEY ('film_id', 'actor_id')
            );`,

            (errQuery) => {
                if (errQuery) {
                // Table already created
                } else {
                // Table just created, creating some rows
                    const insertGenre = 'INSERT INTO genre (name) VALUES (?)';
                    db.run(insertGenre, ['Action']);

                    const insertActors = 'INSERT INTO actors (first_name, last_name, date_of_birth, date_of_death) VALUES (?,?,?,?)';
                    db.run(insertActors, ['Jean','Dujardin','1972-07-19','']);

                    const insertFilms = 'INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?,?,?,?)';
                    db.run(insertFilms, ['OSS117','Agent Secret','','1']);

                    const insertFilms_actors = 'INSERT INTO films_actors (film_id, actor_id) VALUES (?,?)';
                    db.run(insertFilms_actors, ['1','1']);
                }
            },
        );
    }
});

module.exports = db;
