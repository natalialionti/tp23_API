const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': async (req, res) => {
        /*  try {       
        
         db.Movie.findAll({
             include: ['genre']
         })
             .then(movies => {
                 res.render('moviesList.ejs', {movies})
             })
     }}, */

        try {
            let { order = "id" } = req.query;
            let orders = ["id", "title", "name", "rating", "awards", "release_date"];

            if (!orders.includes(order)) {
                throw new Error("El campo " + order + " no existe. Los campos disponibles son id, title, name,rating, awards, release_date."
                )
            }

            let movies = await db.Movie.findAll({
                include: [
                    {
                        association: "genre",
                        attributes: ["name"]
                    }
                ],
                order: [order],
                attributes: {
                    exclude:
                        ["created_at", "updated_at"]
                }
            })
            if (movies.lenght) {
                return res.status(200).json({
                    ok: true,
                    data: movies,
                    meta: {
                        total: movies.lenght
                    }
                })

            }
            throw new Error("No hay películas.")
        }

        catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: error.message ? error.message : "Hubo un error"
            })
        }
    },

    /* 'detail': */ /* (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    }, */

    detail: async (req, res) => {
        try {

            if (isNaN(req.params.id)) {
                throw new Error("El ID debe ser un número")
            };

            let movie = await db.Movie.findByPk(req.params.id, {
                attributes: {
                    exclude:
                        ["created_at", "updated_at"]
                }
            });

            if (movie) {
                return res.status(200).json({
                    ok: true,
                    data: movie,

                })
            }
            throw new Error("La película no existe.")
        }

        catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: error.message ? error.message : "Hubo un error"
            })
        }
    },

    'newest': async (req, res) => {
        try {
            db.Movie.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: req.query.limit || 5
            });

            if (movies.lenght) {
                return res.status(200).json({
                    ok: true,
                    meta: {
                        total: movies.lenght
                    },
                    data: movies
                })
            };

            throw new Error("No hay películas.")

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: error.message ? error.message : "Hubo un error"
            })
        }
    },

    recomended: async (req, res) => {
        try {
            let movies = await db.Movie.findAll({
                include: ["genre"],
                where: {
                    rating: +req.query.rating || 8,
                    order: [
                        ['release_date', 'DESC']
                    ],
                    limit: req.query.limit || 5
                })

            if (movies.lenght) {
                return res.status(200).json({
                    ok: true,
                    meta: {
                        total: movies.lenght
                    },
                    data: movies
                })
            };

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: error.message ? error.message : "Hubo un error"
            })
        }
    },


    //Aqui dispongo las rutas para trabajar con el CRUD
    create: async (req, res) => {
       const {title,rating,awards,release_date,length,genre_id}= req.body;
       
        try {
        let newMovie = await db.Movies.create(
               {
                    title: title && title.trim(),
                    rating: rating,
                    awards: awards,
                    release_date: release_date,
                    length: length,
                    genre_id: genre_id
                }
                    )

                    if (newMovie) {
                        return res.status(200).json({
                            ok: true,
                            meta: {
                                total: 1,
                                url: req.protocol + req.get("host"),
                            },
                            data: newMovie
                        })
                    };

            } 
            catch(error) {
                }
},

    edit: function (req, res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId, { include: ['genre', 'actors'] });
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
            .all([promMovies, promGenres, promActors])
            .then(([Movie, allGenres, allActors]) => {
                Movie.release_date = moment(Movie.release_date).format('L');
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesEdit'), { Movie, allGenres, allActors })
            })
            .catch(error => res.send(error))
    },
    update: function (req, res) {
        let movieId = req.params.id;
        Movies
            .update(
                {
                    title: req.body.title,
                    rating: req.body.rating,
                    awards: req.body.awards,
                    release_date: req.body.release_date,
                    length: req.body.length,
                    genre_id: req.body.genre_id
                },
                {
                    where: { id: movieId }
                })
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    },
    delete: function (req, res) {
        let movieId = req.params.id;
        Movies
            .findByPk(movieId)
            .then(Movie => {
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesDelete'), { Movie })
            })
            .catch(error => res.send(error))
    },
    destroy: function (req, res) {
        let movieId = req.params.id;
        Movies
            .destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    }
}

module.exports = moviesController;