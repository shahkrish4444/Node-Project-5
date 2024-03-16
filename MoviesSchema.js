const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/KrishMovies')
const moviesSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    releaseDate: {
        type: Date
    },
    genres: {
        type: String
    },
    rating: {
        type: String
    },
    movieImage: {
        type: String
    },
})
const movieModel = mongoose.model('movies', moviesSchema)
module.exports = { movieModel } 