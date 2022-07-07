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
            res.json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            res.status(404).json({ error: err.message });
        });
};

exports.film_create = (req, res) => {
    const errors = [];
    ['name', 'synopsis', 'release_year', 'genre_id'].forEach((field) => {
        if (!req.body[field]) {
            errors.push(`Field '${field}' is missing from request body`);
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
            errors.push(`Field '${field}' is missing from request body`);
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
                    res.json({
                        success: true,
                        data: result,
                    });
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};

exports.film_delete = (req, res) => {
    const repo = new FilmRepository(db);

    repo.delete(req.params.id)
        .then(() => {
            res.status(204)
                .json({
                    success: true,
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};
