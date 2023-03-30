const express = require('express');
const {ObjectId} = require("mongodb");
const commentsRouter = express.Router();
commentsRouter.use(function (req, res, next) {
    console.log("routerAudios");
    if ( req.session.user ) {
        next();
    } else {
        res.send("No se ha iniciado sesión")
    }
});
module.exports = commentsRouter