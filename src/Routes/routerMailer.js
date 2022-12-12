// Se especifica la libreria
const { Router } = require('express');
const router = Router();

const { sendMail } = require('../Controllers/controllerMailer');

router.route('/')
    .post(sendMail)

module.exports = router;