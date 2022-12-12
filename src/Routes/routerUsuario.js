const { Router } = require('express');
const router = Router();

const {
    registerVisitante,
    loginVisitante,
    updateDataPersonUser,
    forgotPass,
    setNewPasswordByForgodPass,
    verifyMailAndCodeConfirm,
    userUpdateInfoSession
} = require('../Controllers/controllerUsuario')

/*
router.route('/test')
    .get(test)
*/

router.route('/registerVisitanteUser')
    .post(registerVisitante)

router.route('/userUpdateInfoSession')
    .post(userUpdateInfoSession)

router.route('/loginVisitanteUser')
    .post(loginVisitante)

router.route('/updateDataPersonUser')
    .put(updateDataPersonUser)

router.route('/changePassword/:mail')
    .get(forgotPass)
    .post(verifyMailAndCodeConfirm)
    .put(setNewPasswordByForgodPass)

module.exports = router;