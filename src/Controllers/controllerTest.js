// Creamos la clase
const controllerTest = {};

const { Message } = require('../Utils/Utils');
 
controllerTest.testIndex = (req, res) => {
    res.json(Message(false, 200, "Ok"))
}

module.exports = controllerTest;


// Especificamos el nombre de la "funcion" o la "clase"
/*
const controllerTest = {};

// Especificamos la primera funcion
controllerTest.Test = (req, res) => {
    res.json({
        test: true
    });
}
*/