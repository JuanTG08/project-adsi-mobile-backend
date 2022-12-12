// Se importan las librerias necesarias
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Se instancia la constante del Servidor de Express
const app = express();

// Se importan todas las rutas
const routeTest = require('./Routes/routerTest');
const routeMailer = require('./Routes/routerMailer');
const routerRegional = require('./Routes/routerRegional');
const routeUsuario = require('./Routes/routerUsuario');
const routeSites = require('./Routes/routerSites');
const routeEvents = require('./Routes/routerEvents');
const routeIndex = require('./Routes/routerIndex');
const routeError = require('./Routes/routerError');
const routerComments = require('./Routes/routerComments');

// Pre-Configuraciones
const PORT = process.env.PORT || 2000;
app.set('PORT', PORT);

// Middlewars
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Se insertan las Rutas
app.use('/', routeIndex); // Ruta de pruebas
app.use('/api/testConnection', routeTest) // Ruta de prueba para la coneccion
app.use('/api/sendMail', routeMailer) // Ruta de prueba para el envio de Emails
app.use('/api/User', routeUsuario) // Ruta para el acceso de usuarios
app.use('/api/Sites', routeSites) // Ruta para los sitios
app.use('/api/Events', routeEvents) // Ruta para los Eventos
app.use('/api/regional', routerRegional) // Ruta para los "departamentos"
app.use('/api/Comments', routerComments) // Ruta para los Comentarios
app.use('*', routeError)
// app.use('*', errorController);

module.exports = app;