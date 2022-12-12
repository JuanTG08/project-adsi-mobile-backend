const { Router } = require('express');
const router = Router();

const { confirmacionMail } = require('../Controllers/controllerUsuario')

router.route('/confirmacionMail/:mail/:code_confirm')
    .get(confirmacionMail)

module.exports = router;