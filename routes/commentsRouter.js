const express = require('express');
const {ObjectId} = require("mongodb");
const commentsRouter = express.Router();
commentsRouter.use(function (req, res, next) {
    console.log("routerAudios");
    if ( req.session.user ) {
        if (req.body.text != null && typeof (req.body.text) != "undefined" && req.body.text.trim().length != 0) {
            next();
        } else {
            res.send("El mensaje no es válido");
        }
    } else {
        res.send("No se ha iniciado sesión")
    }
});
module.exports = commentsRouter