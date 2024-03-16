const express = require('express')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const { movieModel } = require('./MoviesSchema.js')
app.set('view engine', 'ejs')
app.use(express.static('Public'))
const multer = require('multer')
const { movie } = require('console')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './upload')
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({ storage: storage }).single('movie')
app.use(express.static('upload'))

app.get('/', async function (req, res) {
    res.render('../Views/Pages/Home')
})
app.get('/movies', async function (req, res) {
    const movie = await movieModel.find({})
    res.render('../Views/Pages/Movie', { movie: movie })
})
app.get('/add', (req, res) => {
    res.render("../Views/Pages/Add")
})
app.post('/upload', async function (req, res) {

    upload(req, res, async function () {
        if (req.file) {
            var details = {
                title: req.body.title,
                description: req.body.dsc,
                releaseDate: req.body.releaseDate,
                genres: req.body.genres,
                rating: req.body.rating,
                movieImage: req.file.filename
            }
            const movie = await movieModel(details)
            const result = await movie.save()
            res.redirect("/movies");
        } else {
            console.log('Error')
        }
    })
})
app.get('/delete/:id', async function (req, res) {
    var id = req.params.id
    var image = await movieModel.findOne({ _id: id })
    var result = await movieModel.deleteOne({ _id: id })
    if (result.acknowledged) {
        fs.unlink(`upload/${image.movieImage}`, (err) => {
            if (err) {
                console.log(err)
            }
            console.log('Success..')
        })
        res.redirect('/movies')
    }
})
app.get('/edit/:id', async function (req, res) {
    var id = req.params.id
    var result = await movieModel.findOne({ _id: id })
    res.render('../Views/Pages/Edit', { movie: result })
})
app.post('/edit/:id', async function (req, res) {
    var id = req.params.id
    const currentmovie = await movieModel.findOne({ _id: id })
    upload(req, res, async function (err) {
        if (err) {
            console.error('File upload error:', err)
        }
        var details = {
            title: req.body.title,
            description: req.body.dsc,
            releaseDate: req.body.releaseDate,
            genres: req.body.genres,
            rating: req.body.rating
        }
        if (req.file) {
            details.movieImage = req.file.filename
            if (currentmovie.movieImage && currentmovie.movieImage !== req.file.filename) {
                fs.unlink(`./upload/${currentmovie.movieImage}`, (err) => {
                    if (err) {
                        console.error(err)
                    }
                });
            }
        }
        await movieModel.updateOne({ _id: id }, details)
        res.redirect("/movies")
    });
});

app.listen(8000, () => {
    console.log('Server Start On Port 8000..')
})