// Se especifica la libreria
const { Router } = require('express');
const router = Router();

// Obtenemos los controladores
const { listDepartamentos, listMunicipios, listZoneApt } = require('../Controllers/controllerRegional')

router.route('/departamentos')
    .get(listDepartamentos)
router.route('/municipios/:codDept')
    .get(listMunicipios)
router.route('/listZoneApt')
    .get(listZoneApt)

module.exports = router;

// Se especifica el objeto que va a contener las rutas
// const routerTest = {};