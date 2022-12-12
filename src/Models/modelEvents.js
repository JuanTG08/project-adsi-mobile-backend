const Conn = require('../DB/connection') // Conexion a la DB
const { Message } = require('../Utils/Utils');

class Events {
    __tablename = 'evento';
    __tablenameFoto = 'fotografia';
    static #idEvent;

    set_idEvent(idEvent) {
        this.idEvent = idEvent;
    }
    get_idEvent() {
        return this.idEvent;
    }

    listAllEvents(zone) {
        const sql = `
            SELECT E.Id_Evento, E.Nombre_Evento, E.Descripcion, E.Calificacion, F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this.__tablename} AS E
            INNER JOIN ${this.__tablenameFoto} AS F ON E.Id_FotoPrincipal=F.Id_Fotografia
            WHERE F.Id_Estado='A' AND E.Zona_APT='${zone}'
            ORDER BY E.Nombre_Evento ASC;
        `;
        return new Promise(resolve => {
            Conn.query(sql, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length ? res : false));
            });
        });
    }

    getAllSite() {
        const sql = `
            SELECT E.Id_Evento, E.Nombre_Evento, E.Descripcion, E.Calificacion, F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this.__tablename} AS E
            INNER JOIN ${this.__tablenameFoto} AS F ON E.Id_FotoPrincipal=F.Id_Fotografia
            WHERE F.Id_Estado='A' AND E.Id_Evento=? AND E.Id_Estado='A';
        `;
        const data = [
            this.get_idEvent(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length > 0 ? res : false));
            });
        });
    }
}

module.exports = Events;