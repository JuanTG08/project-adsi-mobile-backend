const controllerEvents = {};
const { Message } = require('../Utils/Utils');

// Requerimos el model de Usuario Visitante
const Events = require('../Models/modelEvents');
// Requerimos el model de Comentarios
const Comentarios = require('../Models/modelComentarios');

controllerEvents.listAllEvents = async (req, res) => {
    const { zone } = req.body;
    let response = Message(true, 400, "Campos Vacios");
    console.log(zone);
    if (zone) {
        response =  Message(true, 408, "No hay datos disponibles para esto");
        const modelEvents = new Events();
        
        const listEvents = await modelEvents.listAllEvents(zone);
    
        if (!listEvents.error && listEvents.others) response = listEvents;
    }

    res.json(response);
};

controllerEvents.getEventAll = async (req, res) => {
    const { idEvent } = req.params;
    const idUser = 4;
    let response = Message(true, 400, "Campos Vacios");
    if (idEvent) {
        response = Message(true, 408, "No hay datos disponibles para esto");

        const modelEvents = new Events();
        const comentariosModel = new Comentarios();

        modelEvents.set_idEvent(idEvent);
        comentariosModel.set_idEvents(idEvent);

        const getAllEvents = await modelEvents.getAllSite();
        const getListComentarios = await comentariosModel.getListComentariosByIdEvents();
        const getListImagesEvent = await modelEvents.getAllImagesForEvent();

        if ((!getAllEvents.error && getAllEvents.others) && (!getListComentarios.error && getListComentarios.others)) {
            let coments = false;
            let images = false;

            if (!getListComentarios.error && getListComentarios.others) coments = getListComentarios.others;
            if (!getListImagesEvent.error && getListImagesEvent.others) images = getListImagesEvent.others;

            const messageEnd = Message(false, 200, "Ok", {
                event: getAllEvents.others[0],
                coments,
                images,
            });
            response = messageEnd;
        }else {
            response = Message(true, 408, "No hay ninguna coincidencia.");
        }
        
    }    
    res.json(response);
}

module.exports = controllerEvents;