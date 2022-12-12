const controllerUser = {};

// Requerimos el model de Usuario Visitante
const UsuarioVisitanteModel = require('../Models/modelUsuarioVisitante');

const {
    Message,
    verifyMail,
    verifyLengthString,
    verifyDate,
    verifyObjectData,
    sendEmail,
    encryptText,
    decryptText,
    compareEncrypters,
    getConfirmCode,
    isAuthenticated,
    descompressSessionAuth,
    generateSQLAndCompareData,
    getConfirmCodeForwordPass
} = require('../Utils/Utils');

controllerUser.test = (req, res) => {
    const testModelUser = new UserModel();
    testModelUser.setId_usuario(123);
    res.json(Message(false, 200, "Todo Bien"));
}

controllerUser.registerVisitante = async (req, res) => { // Se crea un nuevo Usuario Visitante
    const { body } = req;
    let response = Message(true, 400, "Campos Vacios");

    const dataUserVisitante = {
        nombreusuario: verifyLengthString(body.nombreusuario, 16, 3),
        nombre: verifyLengthString(body.nombre, 30, 3),
        apellidos: verifyLengthString(body.apellidos, 30, 3),
        telefono: verifyLengthString(body.telefono, 15, 9),
        email: verifyMail(body.email),
        direccion: verifyLengthString(body.direccion, 50, 5),
        codmunicipio: verifyLengthString(body.codmunicipio, 5, 5),
        password: verifyLengthString(body.password, 64, 8),
        genero: verifyLengthString(body.genero,1,1),
        fechaNac: body.fechaNac,
        autorizacionTD: verifyLengthString(body.autorizacionTD, 1, 1),
    };

    if (verifyObjectData(dataUserVisitante, ["direccion"])) { // Verificamos los datos
        const modelUser = new UsuarioVisitanteModel();
        modelUser.set_email(dataUserVisitante.email);
        modelUser.set_nombreusuario(dataUserVisitante.nombreusuario);

        const verifyUserByMail = await modelUser.verifyUserByMailOrUsername();
        if (!verifyUserByMail.others) {
            // Creamos la estructura para el envio del correo electrónico de confirmacion
            const codeConfirm = getConfirmCode();
            const url_site = process.env.URL + ":" + process.env.PORT + "/confirmacionMail/" + dataUserVisitante.email + "/" + codeConfirm;
            const html = `
            <script> 
                const openResponseMessage = (URL) => { 
                    window.open(URL,"ventana1","width=120,height=300,scrollbars=NO") 
                }
            </script>
                <div>
                    <h1 style="text-align: center;">Confirmación de Correo Electrónico</h1>
                    <p>Para poder confirmar la validez de la cuenta, debes darle clic al siguiente enlace. <a href="${url_site}">Confirmar Cuenta!</a></p>
                </div>
            `;
            const mailOptions = {
                from: process.env.MAIL_ADDRESS_BOT,
                to: dataUserVisitante.email,
                subject: "Confirmacion de registro (NO RESPONDER)",
                html
            }

            const respMail = await sendEmail(mailOptions);

            if (!respMail.error && respMail.statusCode == 200) { // Si se envio correctamente el correo entonces:
                modelUser.set_nombre(dataUserVisitante.nombre);
                modelUser.set_apellidos(dataUserVisitante.apellidos);
                modelUser.set_telefono(dataUserVisitante.telefono);
                modelUser.set_direccion(dataUserVisitante.direccion);
                modelUser.set_codmunicipio(dataUserVisitante.codmunicipio);
                // modelUser.set_password(encryptText(dataUserVisitante.password)); # Se encripta la Contraseña
                modelUser.set_password(dataUserVisitante.password);
                modelUser.set_codigoconfirmacion(codeConfirm);
                modelUser.set_id_perfil("VIS");
                modelUser.set_id_estado("C");
                modelUser.set_genero(dataUserVisitante.genero);
                modelUser.set_fecha_nac(dataUserVisitante.fechaNac);
                modelUser.set_autorizacion_td(dataUserVisitante.autorizacionTD);

                response = await modelUser.createUserVisitante();
            }else {
                response = Message(true, 408, "No es posible obtener conexión.");
            }
        }else {
            response = Message(true, 400, "Cuenta ya existente.");
        }
    }
    res.json(response);
}

controllerUser.confirmacionMail = async (req, res) => { // Se confirma el usuario mediante el Mail
    let response = Message(true, 400, "Campos Vacios");
    const { mail, code_confirm } = req.params;
    if (mail && code_confirm) {
        const modelUser = new UsuarioVisitanteModel();
        modelUser.set_email(mail);
        modelUser.set_codigoconfirmacion(code_confirm);
        const verifyConfirm = await modelUser.verifyUserByMailAndCodeConfirmation(); // Se confirma que exista el registro para poder actualizar el estado
        if (!verifyConfirm.error && verifyConfirm.others) {
            modelUser.setCodeConfirmNull();
            response = await modelUser.uploadStatusOfUser();
        } else {
            response = Message(true, 406, "No coinciden ninguno de los datos, por favor verificar.", verifyConfirm.others);
        }
    }
    res.json(response)
}

controllerUser.loginVisitante = async (req, res) => { // El usuario se loguea
    let response =  Message(true, 400, "Campos Vacios");
    const { email, password } = req.body;

    const dataUserVisitante = {
        email: verifyMail(email),
        password: verifyLengthString(password, 68, 8),
    };

    if (verifyObjectData(dataUserVisitante)) {
        const modelUser = new UsuarioVisitanteModel();
        modelUser.set_email(dataUserVisitante.email);
        const resUserByMail = await modelUser.getUserVisitanteByMail();
        if (!resUserByMail.error && resUserByMail.statusCode == 200){
            if (resUserByMail.others) {
                let passwordUserEncrypted = resUserByMail.others.Password;
                if (compareEncrypters(passwordUserEncrypted, dataUserVisitante.password)) {
                    /*
                    * Se encripta la información
                    const encryptDataUser = encryptText(JSON.stringify(resUserByMail.others))
                    response = Message(false, 200, "Usuario logueado.", encryptDataUser);
                    */
                   response = Message(false, 200, "Usuario logueado.", resUserByMail.others);
                }else {
                    response = Message(true, 406, "No coinciden los datos.");
                }
            }else {
                response = Message(true, 535, "Usuario inexistente o Inactivo.");
            }
        }else {
            response = resUserByMail;
        }
    }
    res.json(response);
}

controllerUser.userUpdateInfoSession = async (req, res) => {
    const { email, nombreusuario } = req.body;
    let response = Message(true, 400, "Campos Vacios");
    const userData = {
        email: verifyMail(email),
        nombreusuario: verifyLengthString(nombreusuario, 16, 3),
    }
    if (verifyObjectData(userData)) {
        const modelUser = new UsuarioVisitanteModel();
        modelUser.set_email(userData.email);
        modelUser.set_nombreusuario(userData.nombreusuario);
        const responseModelUser = await modelUser.verifyUserByMailAndUsernameAndActive();
        if (!responseModelUser.error && responseModelUser.statusCode == 200 && responseModelUser.others) {
            response = responseModelUser;
            if (responseModelUser.others.length == []) response = Message(true, 702, "El usuario no coincide");
        }else {
            response = responseModelUser;
        }
        
    }
    res.json(response);
}

controllerUser.updateDataPersonUser = async (req, res) => { // Actualizacion de datos personales para cualquier Usuario
    const { body } = req;
    // const session_auth = descompressSessionAuth(body.session_auth_encrypthed_key);
    const session_auth = body.session_auth;
    let response = Message(true, 406, "Campos vacios o Incorrectos.");

    const dataUserBefore = {
        // NombreUsuario: verifyLengthString(body.NombreUsuario, 16, 3),
        Nombres: verifyLengthString(body.Nombres, 30, 3),
        Apellidos: verifyLengthString(body.Apellidos, 30, 3),
        Telefono: verifyLengthString(body.Telefono, 15, 9),
        Direccion: verifyLengthString(body.Direccion, 50, 5),
        CodMunicipio: verifyLengthString(body.CodMunicipio, 5, 5),
        Genero: verifyLengthString(body.Genero, 1, 1),
    };

    if (verifyObjectData(dataUserBefore, ["direccion", "codmunicipio"/* El codigo de Municipio no es necesario */])) {
        if (session_auth) {
            const modelUser = new UsuarioVisitanteModel();
            modelUser.set_id_usuario(session_auth.Id_Usuario);
            modelUser.set_email(session_auth.Email);
            modelUser.set_password(session_auth.Password);
            const resUserVerifyUser = await modelUser.verifyIsAuthenticatedUser();
            if (!resUserVerifyUser.error) {
                if (resUserVerifyUser.others) { // Si trae un usuario entonces...
                    const dataUserAfter = resUserVerifyUser.others;
                    const sqlSetData = generateSQLAndCompareData(dataUserAfter, dataUserBefore);
                    if (sqlSetData) {
                        const updateUser = await modelUser.uploadDataUser(sqlSetData.sql, sqlSetData.data);

                        const resUserByMail = await modelUser.getUserVisitanteByMail();
                        if (updateUser && !resUserByMail.error && resUserByMail.statusCode == 200 && resUserByMail.others) {
                            response = Message(false, 200, "Se actualizo correctamente", resUserByMail.others);
                        }else {
                            console.log(resUserByMail);
                            response = updateUser;
                        }
                        
                    } else {
                        response = Message(false, 200, "Los datos ya estan actualizados.")
                    }
                }else {
                    // No coinciden la llave, no se encuentra el usuario
                    response = Message(true, 702, "Verificacion Invalida")
                }
            }else {
                // La conexion a la DB no existe
            }
        }
    }

    res.json(response)
}

controllerUser.forgotPass = async (req, res) => { // Olvidaste tu contraseña
    let response = Message(true, 400, "Correo Invalido");
    const { mail } = req.params;
    if (mail && verifyMail(mail)) {
        const modelUser = new UsuarioVisitanteModel();
        modelUser.set_email(mail);
        const codeConfirm = getConfirmCodeForwordPass(); // Se obtiene el numero random de codigo de confirmacion
        const verifyMail = await modelUser.verifyUserByMail();
        const setCodeConfirmUser = await modelUser.uploadCodeConfirmUser(codeConfirm);
        if (setCodeConfirmUser.error && !setCodeConfirmUser.others) return setCodeConfirmUser;
        if (!verifyMail.error && verifyMail.statusCode == 200) {
            const mailOptions = {
                from: process.env.MAIL_ADDRESS_BOT,
                to: mail,
                subject: `El codigo de confirmación es: [${codeConfirm}]`,
                html: `<h1>El codigo de confirmación es: [${codeConfirm}]</h1>`
            };
            const sendEmailResp = await sendEmail(mailOptions);
            if (!sendEmailResp.error && sendEmailResp.statusCode == 200) {
                response = Message(false, 200, "Se te envio a tu correo el codigo de confirmación.")
            }else {
                response = sendEmailResp;
            }
        }else {
            response = verifyMail;
        }
    }
    return res.json(response);
}

controllerUser.verifyMailAndCodeConfirm = async (req, res) => { // Se verifica que el correo y el codigo de confirmación coincida con la DB
    const { codeConfirm } = req.body;
    const { mail } = req.params;
    let message = Message(true, 400, "Campos Vacios.")
    if (!verifyMail(mail) || !verifyLengthString(codeConfirm, 32, 2)) return res.json(message);
    const modelUser= new UsuarioVisitanteModel();
    modelUser.set_email(mail);
    modelUser.set_codigoconfirmacion(codeConfirm);
    const verifyDataMailAndCode = await modelUser.verifyCodeConfirmByMail();
    if (!verifyDataMailAndCode.others) response = Message(true, 702, "No se encontro ningun resultado.");
    else response = verifyDataMailAndCode;
    return res.json(response);
}

controllerUser.setNewPasswordByForgodPass = async (req, res) => { // Establecemos nueva contraseña al olvidar tu contraseña
    const { mail } = req.params;
    const { password, codeConfirm } = req.body;
    let response = Message(true, 400, "Campos Vacios.")
    if (!verifyMail(mail) || !verifyLengthString(codeConfirm, 32, 2) || !verifyLengthString(password, 32, 8)) return res.json(response);
    const modelUser= new UsuarioVisitanteModel();
    modelUser.set_email(mail);
    modelUser.set_codigoconfirmacion(codeConfirm);
    const verifyDataMailAndCode = await modelUser.verifyCodeConfirmByMail();
    if (verifyDataMailAndCode.others) {
        modelUser.set_password(password /* encryptText(password) */);
        const uploadPasswordByMail = await modelUser.uploadPasswordByMail();
        await modelUser.setCodeConfirmNull();
        response = uploadPasswordByMail;
    }else {
        response = Message(true, 702, "Las credenciales no coinciden.");
    }
    return res.json(response);
}


module.exports = controllerUser;