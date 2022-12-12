const controllerRegional = {};

const { Message } = require('../Utils/Utils');
const modelDepartamentos = require('../Models/modelRegional');
const modelZoneApt = require('../Models/modelZoneApt');
 
controllerRegional.listDepartamentos = async (req, res) => {
    let data = new modelDepartamentos();
    data = await data.getListDepartamentos();
    res.json(Message(false, 200, "departamentos", data))
}

controllerRegional.listMunicipios = async (req, res) => {
    const codDept = req.params.codDept;
    let data = new modelDepartamentos();
    data = await data.getListMunicipios(codDept);
    if (data && data.length > 0) {
        res.json(Message(false, 200, "Ok", data))
    }else {
        res.json(Message(true, 701, "No es posible obtener los municipios"))
    }    
}

controllerRegional.listZoneApt = async (req, res) => {
    let response = Message(true, 701, "No es posible obtener la Zona");
    let modelZone = new modelZoneApt();
    listZones = await modelZone.listZonesApt();
    if (!listZones.error && listZones.others) response = listZones;
    res.json(response);
          
}

module.exports = controllerRegional;