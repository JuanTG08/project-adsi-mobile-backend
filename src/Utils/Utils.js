const Utils = {};
// Se requiere la libreria para el envio del mensaje
const nodemailer = require('nodemailer');
// Se requiere la libreria para el encriptamiento
const CryptoJS = require('crypto-js');
// Se requiere la libreria para la comparacion de tiempo
const momentJS = require('moment');


// Estructruracion de los mensajes
Utils.Message = (error, statusCode, message, others = false) => {
    return {
        error,
        statusCode,
        message,
        others
    }
}

// Envio de Correos electronicos
Utils.sendEmail = async (mailOptions) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ADDRESS_BOT,
            pass: process.env.PASSWORD_ADDRESS_BOT,
        },
    });
    return new Promise((resolve) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if ((!err || err == null) && info) {
                resolve(Utils.Message(false, 200, "El mensaje por Correo se envio correctamente."));
            } else {
                resolve(Utils.Message(true, 535, "Error en las credenciales."))
            }
        })
    })
}

/*

    Encriptacion
    Y
    Desencriptacion

*/

// Encriptamos
Utils.encryptText = text => {
    const textEncrypted = CryptoJS.AES.encrypt(text, process.env.SECRET_HASH);
    return textEncrypted.toString();
}
// Desencriptamos
Utils.decryptText = textCrypt => {
    const text = CryptoJS.AES.decrypt(textCrypt, process.env.SECRET_HASH);
    return text.toString(CryptoJS.enc.Utf8);
}
// Comparamos
Utils.compareEncrypters = (encryptText, text) => {
    // return Utils.decryptText(encryptText) === text; Se desencripta las Contraseñas y se comparan
    return encryptText === text; 
}


/*

    Verificacion de Datos

*/
// Verificacmos el correo electronico
Utils.verifyMail = (mail) => {
    const expresionMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    return (expresionMail.test(mail)) ? mail : false;
}
// Verificamos la cantidad de caracteres de una cadena
Utils.verifyLengthString = (string, max, min = 0) => {
    if (string == undefined) return false;
    stringStr = String(string);
    lengthStr = stringStr.length;
    return (lengthStr >= min && lengthStr <= max) ? string : false;
}
// Verificamos la fecha
Utils.verifyDate = (date) => {
    return (momentJS(date, 'YYYY-MM-DD', true).isValid()) ? date : false;
}

// Verificamos los datos de un Objeto para
Utils.verifyObjectData = (data, exception = []) => {
    let response = true;
    for (let indice in data) {
        value = data[indice];
        if (exception.find(e => e == indice)) continue;
        if (value == false || value.length < 1 || typeof value == undefined || value == null) {
            response = false;
            break;
        }
    }
    return response;
}

// Verificamos que los datos dados y los datos de la DB coincidan y generar el SQL necesario
Utils.generateSQLAndCompareData = (dataAfter, dataBefore) => {
    let sql = "";
    let data = [];
    for (dataA in dataAfter) {
        if (!dataBefore[dataA]) continue;
        if (dataAfter[dataA] != dataBefore[dataA]) {
            sql += ((sql == "") ? "" : ", ") + dataA +"=?"
            data.push(dataBefore[dataA]);
        }
    }
    return (sql == "") ? false : {
        sql,
        data
    };
}

// Obtenemos el Codigo de Configuracion
Utils.getConfirmCode = () => {
    const date = new Date();
    return date.getDay() + "" + date.getTime() + "" + date.getFullYear() + "" +  date.getMonth();
}
Utils.getConfirmCodeForwordPass = () => {
    const date = new Date();
    return date.getSeconds() + "" + date.getMinutes() + "" + date.getDay();
}


/*
    Comprobamos que el usuario este logueado
    !!! SE HARA MAS ADELANTE !!!
*/

Utils.transformJsonOfString = (string) => {
    try {
        return JSON.parse(string);
    } catch (e) {
        return false;
    }
}

Utils.descompressSessionAuth = (session_auth_encrypthed) => {
    const session_auth = Utils.decryptText(session_auth_encrypthed);
    return Utils.transformJsonOfString(session_auth);
}

Utils.isAuthenticated = (session_auth_encrypthed) => {
    let response = false;
    const session_auth = Utils.descompressSessionAuth(session_auth_encrypthed);
    if (session_auth) {
        response = session_auth;
    }
    return response;
}

module.exports = Utils;