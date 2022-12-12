// Se especifica la libreria
const { Router } = require('express');
const router = Router();

// Obtenemos los controladores
const { listAllSites, listTopSites, getSite } = require('../Controllers/controllerSites')

router.route('/') // Obtenemos todas las rutas
    .post(listAllSites)

router.route('/getSite/:siteId/') // Obtenemos los datos de un sitio en especifico
    .get(getSite)

router.route('/listTopSites') // Obtenemos listado de mejores sitios
    .post(listTopSites)

module.exports = router;