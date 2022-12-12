// Se especifica la libreria
const { Router } = require('express');
const router = Router();

// Obtenemos los controladores
const { saveComment } = require('../Controllers/controllerComments');

router.route('/saveComment') // Obtenemos todas las rutas
    .post(saveComment)

module.exports = router;