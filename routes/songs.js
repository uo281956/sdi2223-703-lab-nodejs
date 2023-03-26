const songsRepository = require("../repositories/songsRepository");
const {ObjectId} = require("mongodb");
module.exports = function (app, songsRepository) {
    app.get("/songs", function (req, res) {
        let songs = [{
            "title": "Blanck space",
            "price": "1.2"
        },{
            "title": "See you again",
            "price": "1.3"
        },{
            "title": "Uptown Funk",
            "price": "1.1"
        }];

        let response = {
            seller: 'Tienda de canciones',
            songs: songs
        };
        res.render("shop.twig", response);
    });

    //app.get('/add', function(req, res) {
    //    let response = parseInt(req.query.num1) + parseInt(req.query.num2);
    //    res.send(response);
    //});

    app.get('/songs/:kind/:id', function(req, res) { let response = 'id: ' + req.params.id + '<br>'
        + 'Tipo de música: ' + req.params.kind; res.send(response);
    });

    app.get('/songs/add',function(req,res) {
       res.render("songs/add.twig");
    });

    app.post('/songs/add',function(req,res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price
        }
        songsRepository.insertSong(song, function (songId) {
            if(songId==null) {
                res.send("Error al insertar canción");
            } else {
                if (req.files != null) {
                    let imagen = req.files.cover;
                    imagen.mv(app.get("uploadPath") + '/public/covers/' + songId + '.png', function (err) {
                        if (err) {
                            res.send("Error al subir la portada de la canción")
                        } else {
                            if (req.files.audio != null) {
                                let audio = req.files.audio;
                                audio.mv(app.get("uploadPath") + '/public/audios/' + songId + '.mp3', function (err) {
                                    if (err) {
                                        res.send("Error al subir el audio");
                                    } else {
                                        res.send("Agregada la canción ID: " + songId);
                                    }
                                });
                            }
                        }
                    })
                } else {
                    res.send("Agregada la canción ID: " + songId)
                }
            }
        });
    });

    app.get('/songs/:id', function(req, res) {
        let filter = {_id: ObjectId(req.params.id)};
        let options = {};
        songsRepository.findSong(filter, options).then(song => {
            res.render("songs/song.twig",{song:song});
        }).catch(error => {
            res.send("Se ha producido un error al buscar la canción" + error);
        });
    });

    app.get('/shop', function (req,res) {
        let filter = {};
        let options =  {sort: {title:1}};
        if(req.query.search !=null && typeof(req.query.search) != "undefined" && req.query.search != "") {
            filter = {"title": {$regex:".*"+req.query.search+".*"}};
        }

        songsRepository.getSongs(filter, options).then(songs => {
            return res("shop.twig",{songs: songs});
        }).catch(error => {
            res.send("Se ha producido un error al listar las canciones "+ error);
        });
    });
};