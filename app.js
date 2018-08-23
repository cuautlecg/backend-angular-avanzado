//requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Incializar variables
var app = express();

//body-parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



//importar rutas
var appRoutes = require('./routes/app');
var usariosRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    if ( err ) throw err;

    console.log('La base de datos se encuentra:, \x1b[35m', 'online');
});

//rutas
app.use('/usuario', usariosRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express se encuentra escuchando peticiones desde el puerto 3000');
});

