var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//Modelo de usuario
var Usuario = require('../models/usuario');

//====================================
//Consulta de usuarios
//====================================
app.get('/', (req, res, next) => {
    Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
        if (err) {
            return res
                .status(500)
                .json({
                    error: true,
                    mensaje:
                        "Hubo un error al consultar la base de datos, intentalo nuevamente.",
                    errors: err
                });
        }

        res.status(200).json({ error: false, usuarios });
    });
});

//====================================
//Actualización de usuario
//====================================

app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        console.log(usuario);

        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Hubo un error en la busqueda del usuario",
                err: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                error: true,
                mensaje: "No existe ningun usuario con el id por favor, intentalo nuevamente",
                err: { message: 'No existen ningún usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: "Hubo un error al actualizar el usuario, por favor intentalo nuevamente.",
                    errors: err
                });
            }

            usuarioActualizado.password = ':)';

            res.status(200).json({
                error: false,
                usuario: usuarioActualizado
            });
        });


    });

});

//====================================
//Creación de nuevo usuario
//====================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    console.log(usuario);

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: "Hubo un error al crear al usuario, por favor intentalo nuevamente.",
                errors: err
            });
        }

        res.status(201).json({
            error: false,
            usuario: usuarioGuardado
        });
    });
});



//====================================
//Buscar un solo usuario
//====================================

app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findById(id, (err, usuarioEncontrado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Hubo un error al hacer la busqeda, por favor intentalo nuevamente.",
                errors: err
            });
        }

        if (!usuarioEncontrado) {
            return res.status(404).json({
                error: true,
                mensaje: 'No se encontro al usuario con el id' + id,
                errors: { message: 'No se encontro un usuario' }
            });
        }

        usuarioEncontrado.password = ':)';

        res.status(200).json({
            error: false,
            usuario: usuarioEncontrado
        });

    });
});

//====================================
//Eliminar usuario
//====================================

app.delete('/:id', mdAutenticacion.verificaToken,(req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Hubo un error al eliminar al usuario',
                err: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(404).json({
                error: true,
                mensaje: 'No se encontro al usuario con el id ' + id,
                errors: { message: 'No se encontro un usuario' }
            });
        }

        res.status(200).json({
            error: false,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;