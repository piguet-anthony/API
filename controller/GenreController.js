const db = require('../database');
const GenreRepository = require('../repository/GenreRepository');

exports.genre_list = (req, res) => {
    const repo = new GenreRepository(db);
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

exports.genre_get = (req, res) => {
    const repo = new GenreRepository(db);
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

exports.genre_create = (req, res) => {
    const errors = [];
    ['name'].forEach((field) => {
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

    const repo = new GenreRepository(db);

    repo.create({
        name: req.body.name,
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

exports.genre_update = (req, res) => {
    const errors = [];
    ['contents', 'done'].forEach((field) => {
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

    const repo = new GenreRepository(db);

    repo.update(
        req.params.id,
        {
            contents: req.body.contents,
            done: req.body.done === 'true',
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

exports.genre_delete = (req, res) => {
    const repo = new GenreRepository(db);

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
