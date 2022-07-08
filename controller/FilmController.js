const md5 = require('md5');
const db = require('../database');
const FilmRepository = require('../repository/FilmRepository');

exports.film_list = (req, res) => {
    const repo = new FilmRepository(db);
    repo.list()
        .then((result) => {
            res.json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.film_get = (req, res) => {
    const repo = new FilmRepository(db);
    repo.get(req.params.id)
        .then((result) => {
            if(result == '404'){
                res.status(404).json({ error: "Erreur identifiant non valide" });
            }else{
                const etag = md5(JSON.stringify(result));
                res.set('ETag', etag)
                    .json({
                        success: true,
                        data: result,
                    });
            }
        })
        .catch((err) => {
            res.status(404).json({ error: err.message });
        });
};

exports.film_create = (req, res) => {
    const errors = [];
    ['name', 'synopsis', 'release_year', 'genre_id'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Le champs '${field}' est manquant dans le corps de votre requête`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new FilmRepository(db);

    repo.create({
        name: req.body.name,
        synopsis: req.body.synopsis,
        release_year: req.body.release_year,
        genre_id: req.body.genre_id,
    })
        .then((result) => {
            res
                .status(201)
                .json({
                    success: true,
                    id: result,
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};

exports.film_update = (req, res) => {
    const errors = [];
    ['name', 'synopsis', 'release_year', 'genre_id'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Le champs '${field}' est manquant dans le corps de votre requête`);
        }
    });
    if (errors.length) {
        res.status(400).json({
            success: false,
            errors,
        });
        return;
    }

    const repo = new FilmRepository(db);

    repo.update(
        req.params.id,
        {
            name: req.body.name,
            synopsis: req.body.synopsis,
            release_year: req.body.release_year,
            genre_id: req.body.genre_id,
        },
    )
        .then(() => {
            repo.get(req.params.id)
                .then((result) => {
                    if(result == '404'){
                        res.status(404).json({ error: "Erreur identifiant non valide" });
                    }else{
                        res.json({
                            success: true,
                            data: result,
                        });
                    }
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};

exports.film_delete = (req, res) => {
    const repo = new FilmRepository(db);

    repo.delete(req.params.id)
    .then((result) => {
        if(result == '404'){
            res.status(404).json({ error: "Erreur identifiant non valide" });
        }else{
            res.status(204)
                .json({
                    success: true,
                });
        }
    })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};
