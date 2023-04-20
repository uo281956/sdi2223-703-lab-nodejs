const jwt = require("jsonwebtoken");
const express = require('express');
const path = require("path");
const {ObjectId} = require("mongodb");
const songsRepository = require("../repositories/songsRepository");
const userAPICheckRouter = express.Router();
userAPICheckRouter.use(function (req, res, next) {
    console.log("userAPICheckRouter");
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        jwt.verify(token, 'Secreto', {}, function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.time) > 240) {
                res.status(403); // Forbidden
                res.json({
                    authorized: false,
                    error: 'Token inválido o caducado'
                });
            } else {
                // dejamos correr la petición
                let songId = path.basename(req.originalUrl);
                let filter = {_id: ObjectId(songId)};
                songsRepository.findSong(filter, {}).then(song => {
                    if (song.author != infoToken.user) {
                        res.valid = false;
                    }
                    next();
                }).catch(error => {
                    res.redirect("/shop");
                });
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({
            authorized: false,
            error: 'No hay Token'
        });
    }
});
module.exports = userAPICheckRouter;