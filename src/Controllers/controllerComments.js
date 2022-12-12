const controllerEvents = {};
const { Message } = require('../Utils/Utils');

const Comentarios = require('../Models/modelComentarios');
const Utils = require('../Utils/Utils');

// Se requiere la libreria para la comparacion de tiempo
const momentJS = require('moment');

controllerEvents.saveComment = async (req, res) => {
    const {
        Id_Sitio,
        Id_Evento,
        Comentario,
        Id_Usuario
    } = req.body;

    let response = Message(true, 400, "Campos Vacios");

    const data = {
        Id_Sitio: Utils.verifyLengthString(Id_Sitio, 15, 1),
        Id_Evento: Utils.verifyLengthString(Id_Evento, 10, 1),
        Comentario: Utils.verifyLengthString(Comentario, 200, 1),
        Id_Usuario: Utils.verifyLengthString(Id_Usuario, 11, 1),
    }

    if (Utils.verifyObjectData(data, ['Id_Sitio', 'Id_Evento']) && (data.Id_Evento || data.Id_Sitio)) {
        const Comentario = new Comentarios();
        Comentario.set_idSite(data.Id_Sitio ? data.Id_Sitio : null);
        Comentario.set_idEvents(data.Id_Evento ? data.Id_Evento : null);
        Comentario.set_Comentario(data.Comentario);
        
        Comentario.set_fechaHora(momentJS().format());
        Comentario.set_idEstado('A');
        Comentario.set_idUsuario(data.Id_Usuario);

        const saveComment = await Comentario.saveComentario();
        response = saveComment;
    }
    res.json(response);
};

module.exports = controllerEvents;