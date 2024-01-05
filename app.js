const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql');
const app = express();

//Establecer motor de plantillas ejs:
app.set('view engine', 'ejs');

//Carpeta public
app.use(express.static('public'));

// Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Seteamos variables de entorno
dotenv.config({path:'./env/.env'});

// //Para trabajar con cookies
app.use(cookieParser());

//Definir Rutas
app.use('/',require ('./routes/router.js'))

//Eliminar cache luego de que hacemos Logout
app.use(function(req,res,next){
    if(!req.user)
    res.header('Cache-Control','private, no-cache, no-store, must-revalidate');
    next();
});

port=3000
app.listen(port,()=> {
    console.log("Servidor corriendo en puerto:" ,port);
});