const Conn = require('../DB/connection') // Conexion a la DB

const { Message } = require('../Utils/Utils');

class modelZoneApt {
    __tableName = "apturismo";

    listZonesApt() {
        const sql = `SELECT * FROM ${this.__tableName};`;
        return new Promise(resolve => {
            Conn.query(sql, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok.", res.length > 0 ? res : false));
            });
        });
    }
}

module.exports = modelZoneApt;