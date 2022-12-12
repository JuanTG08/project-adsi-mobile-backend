const controllerSite = {};
const { Message } = require('../Utils/Utils');

// Requerimos el model de Sitios
const Sites = require('../Models/modelSites');
// Requerimos el model de Comentarios
const Comentarios = require('../Models/modelComentarios');

controllerSite.listAllSites = async (req, res) => {
    const { zone } = req.body;
    let response = Message(true, 400, "Campos Vacios");
    if (zone) {
        response = Message(true, 408, "No hay datos disponibles para esto");
        const siteModel = new Sites();
        const listSites = await siteModel.listAllSites(zone);
        if (!listSites.error && listSites.others) response = listSites;
    }
    res.json(response);
}

controllerSite.listTopSites = async (req, res) => {
    const { zone } = req.body;
    let response = Message(true, 400, "Campos Vacios");
    if (zone) {
        response = Message(true, 408, "No hay datos disponibles para esto");
        const siteModel = new Sites();
        const listTopSites = await siteModel.listTopSites(zone);
    
        if (!listTopSites.error && listTopSites.others) response = listTopSites;
    }    
    res.json(response);
}

controllerSite.getSite = async (req, res) => {
    const { siteId/* , idUser  */ } = req.params;
    let response = Message(true, 400, "Campos Vacios");
    if (siteId /* && idUser */) {
        response = Message(true, 408, "No hay datos disponibles para esto");

        const siteModel = new Sites();
        const comentariosModel = new Comentarios();

        siteModel.set_idSite(siteId);
        comentariosModel.set_idSite(siteId);

        const getAllSite = await siteModel.getAllSite();
        const getListComentarios = await comentariosModel.getListComentariosByIdSite();
        const getListImagesSites = await siteModel.getAllImagesForSite();

        if ((!getAllSite.error && getAllSite.others)) {
            let coments = false;
            let images = false;

            if (!getListComentarios.error && getListComentarios.others) coments = getListComentarios.others;
            if (!getListImagesSites.error && getListImagesSites.others) images = getListImagesSites.others;

            const messageEnd = Message(false, 200, "Ok", {
                site: getAllSite.others[0],
                coments,
                images,
            });
            response = messageEnd;
        }else {
            response = response = Message(true, 408, "No hay ninguna coincidencia.");;
        }
        
    }    
    res.json(response);
}

module.exports = controllerSite;