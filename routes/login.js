var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

//Modelo de usuario
var Usuario = require('../models/usuario');

app.post('/', (req,res,next) => {

    var body = req.body;
 
    Usuario.findOne({email: body.email}, (err, usuarioEncontrado) => {
        if(err){
            return res.status(500).json({
                error: true,
                mensaje: "Hubo un error al hacer login",
                err: err
            });
        }

        if(!usuarioEncontrado){
            return res.status(400).json({
                error: true,
                mensaje: "Crendeciales invalidas, ingresa nuevamente tus datos",
                errors: err
            });
        }

        if(!bcrypt.compareSync( body.password, usuarioEncontrado.password )){
            return res.status(400).json({
                error: true,
                mensaje: "Credenciales invalidas, ingresa nuevamente tus datos",
                errors: err
            });
        }

        usuarioEncontrado.password = '=)';
        var token = jwt.sign({ usario: usuarioEncontrado }, SEED , { expiresIn: 14400 });

        res.status(200).json({
            error: false,
            usario: usuarioEncontrado,
            token: token,
            id: usuarioEncontrado._id
        });
    });

});




module.exports = app;