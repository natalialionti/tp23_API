const express = require('express');
const router = express.Router();
const {list,detail,newest,recomended,create,update,destroy} = require('../controllers/moviesController');

router.get('/movies', list);
router.get('/movies/:id', detail);
router.get('/movies/new', newest);
router.get('/movies/recommended', recomended);

//Rutas exigidas para la creación del CRUD
router.post('/movies/', create);
router.put('/movies/:id', update);
router.delete('/movies/:id', destroy);

module.exports = router;