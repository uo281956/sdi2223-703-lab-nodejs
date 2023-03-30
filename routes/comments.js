const {ObjectId} = require("mongodb");
module.exports = function (app, commentsRepository) {
    app.post('/comments/:song_id',function(req,res) {
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
};