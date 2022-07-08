const md5 = require('md5');
const express = require('express');
const actorController = require('../controller/ActorController');
const genreController = require('../controller/GenreController');
const filmController = require('../controller/FilmController');

const router = express.Router();

router.get('/actor', actorController.actor_list);
router.get('/actor/:id', actorController.actor_get);
router.post('/actor', actorController.actor_create);
router.put('/actor/:id', actorController.actor_update);
router.delete('/actor/:id', actorController.actor_delete);

router.get('/genre', genreController.genre_list);
router.post('/genre', genreController.genre_create);
router.delete('/genre/:id', genreController.genre_delete);

router.get('/film', filmController.film_list);
router.get('/film/:id', filmController.film_get);
router.post('/film', filmController.film_create);
router.put('/film/:id', filmController.film_update);
router.delete('/film/:id', filmController.film_delete);

module.exports = router;
