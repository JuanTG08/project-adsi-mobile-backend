const { Router } = require('express');
const router = Router();

const { error404 } = require('../Controllers/controllerError');

router.route('*')
    .all(error404)

module.exports = router;