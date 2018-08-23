var express = require('express');
var app = express();

//rutas
app.get('/', (req,res, next) => {
    res.status(200).json({
        saludo: "hola mundo"
    });
});

module.exports = app;