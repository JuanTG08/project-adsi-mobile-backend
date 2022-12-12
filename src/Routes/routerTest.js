// Se especifica la libreria
const { Router } = require('express');
const router = Router();

// Obtenemos los controladores
const { testIndex } = require('../Controllers/controllerTest')

router.route('/')
    .get(testIndex)

module.exports = router;

// Se especifica el objeto que va a contener las rutas
// const routerTest = {};