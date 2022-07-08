const md5 = require('md5');
const db = require('../database');
const ActorRepository = require('../repository/ActorRepository');

exports.actor_list = (req, res) => {
    const repo = new ActorRepository(db);
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

exports.actor_get = (req, res) => {
    const repo = new ActorRepository(db);
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

exports.actor_create = (req, res) => {
    const errors = [];
    ['first_name', 'last_name', 'date_of_birth', 'date_of_death'].forEach((field) => {
        if (!req.body.hasOwnProperty(field)) {
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

    const repo = new ActorRepository(db);

    repo.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
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

exports.actor_update = (req, res) => {
    const errors = [];
    ['first_name', 'last_name', 'date_of_birth', 'date_of_death'].forEach((field) => {
        if (!req.body.hasOwnProperty(field)) {
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

    const repo = new ActorRepository(db);
    let etag = '';
    repo.get(req.params.id)
        .then((result) => {
            etag = md5(JSON.stringify(result));
        })
        .catch((err) => {
            res.status(404).json({ error: err.message });
        });
    //console.log(req.get('If-Match'));
   
    repo.update(
        req.params.id,
        {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        },
    )
        .then(() => {
            repo.get(req.params.id)
                .then((result) => {
                    if(result == '404'){
                        res.status(404).json({ error: "Erreur identifiant non valide" });
                    }else{
                        const match = req.get('If-Match')
                        console.log(match, etag);
                        if (match == etag) {
                            res.json({
                                success: true,
                                data: result,
                            });
                        } else {
                            res.status(412).json({ error: 'ETag non valide, des modifications ont déjà été apportées' });
                        }
                    }
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err.message });
        });
};

exports.actor_delete = (req, res) => {
    const repo = new ActorRepository(db);

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
