//requires 
var express = require('express');
var mongoose = require('mongoose');



//Incializar variables
var app = express();

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    if ( err ) throw err;

    console.log('La base de datos se encuentra:, \x1b[35m', 'online');
});

//rutas

app.get('/', (req,res, next) => {
    res.status(200).json({
        saludo: "hola mundo"
    });
});



//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express se encuentra escuchando peticiones desde el puerto 3000');
});

