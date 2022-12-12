// Se especifica la libreria
const { Router } = require('express');
const router = Router();

// Obtenemos los controladores
const { listAllEvents, getEventAll } = require('../Controllers/controllerEvents')

router.route('/') // Obtenemos todas las rutas
    .post(listAllEvents)

router.route('/getEvents/:idEvent')
    .get(getEventAll)

module.exports = router;