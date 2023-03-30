const {ObjectId} = require("mongodb");
const commentsRepository = require("../repositories/commentsRepository");
module.exports = function (app, commentsRepository) {
    app.post('/comments/:song_id',function(req,res) {
        if (req.body.text != null && typeof (req.body.text) != "undefined" && req.body.text.trim().length != 0) {
            //Todo perfecto
        } else {
            res.send("El mensaje no es válido");
        }
        let comment = {
            text: req.body.text,
            author: req.session.user,
            song_id: ObjectId(req.params.song_id)
        }
        commentsRepository.insertComment(comment, function (commentId) {
            if (commentId == null) {
                res.send("Error al insertar comentario");
            } else {
                res.redirect("/songs/"+req.params.song_id);
            }
        });
    });
    app.get('/comments/delete/:id',function(req,res) {
        let filter = {_id: ObjectId(req.params.id)};
        commentsRepository.findComment(filter, {}).then(comment => {
            if (comment.author == req.session.user) {
                commentsRepository.removeComment(filter, function (commentId) {
                    if (commentId == null) {
                        res.send("Error al eliminar comentario");
                    } else {
                        res.send("eliminado");
                    }
                });
            } else {
                res.send("No eres el autor del mensaje");
            }
        }).catch(error => {
            res.send("No se ha encontrado el mensaje a eliminar"+ error);
        });
    });
};