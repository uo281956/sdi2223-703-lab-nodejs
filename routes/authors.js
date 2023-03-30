module.exports = function (app) {
    app.get("/authors", function (req, res) {
        let authors = [{
            "name": "Victor Manuel",
            "group": "Asturias",
            "rol": "Guitarrista"
        },{
            "name": "Fernando Alonso",
            "group": "F1",
            "rol": "Cantante"
        },{
            "name": "Andrés Iniesta",
            "group": "Spain",
            "rol": "Pianista"
        }];

        let response = {
            authors: authors
        };
        res.render("authors/authors.twig", response);
    });

    app.get('/authors/add',function(req,res) {
        res.render("authors/add.twig");
    });

    app.post('/authors/add',function(req,res) {
        let response = "";
        let valid = false;
        if(req.body.nombre !=null && typeof(req.body.nombre) != "undefined" && req.body.nombre.trim().length != 0) {
            valid = true;
        } else {
            response = "Paramentros erroneos, el nombre es incorrecto";
        }

        if(req.body.grupo !=null && typeof(req.body.grupo) != "undefined" && req.body.grupo.trim().length != 0 && valid) {
            response = "Autor agregado { nombre: "+req.body.nombre +", grupo: "+req.body.grupo +", rol:"+req.body.rol +"}";
        } else if(valid){
            response = "Paramentros erroneos, el grupo es incorrecto";
        }

        res.send(response);
    });

    app.get('/authors/*', function(req, res) {
        res.redirect("/authors");
    });
};