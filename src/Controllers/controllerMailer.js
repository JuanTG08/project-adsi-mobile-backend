const controllerMailer = {};

// Importamos la libreria nodemailer para el proceso de enviar mails
const nodemailer = require('nodemailer');

const { Message, sendEmail, verifyMail, verifyLengthString } = require('../Utils/Utils');

controllerMailer.sendMail = async (req, res) => {
    // let testAccount = await nodemailer.createTestAccount();
    let messa = Message(false, 200, "Ok");

    const { body } = req;

    const mailOptions = {
        from: process.env.MAIL_ADDRESS_BOT,
        to: verifyMail(body.toMail),
        subject: verifyLengthString(body.subject, 100, 2),
        text: verifyLengthString(body.text, 100, 2),
        html: verifyLengthString(body.html, 1000, 2),
    }

    if (mailOptions.to && mailOptions.subject && (mailOptions.text || mailOptions.html)){
        const responseMail = await sendEmail(mailOptions);
        messa = responseMail;
    }
    res.json(messa);
}

module.exports = controllerMailer;