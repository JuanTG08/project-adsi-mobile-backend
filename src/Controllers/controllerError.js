const controllerError = {};

const { Message } = require("../Utils/Utils");

controllerError.error404 = (req, res) => {
    res.json(Message(true, 404, "Page not Found"));
}

module.exports = controllerError;