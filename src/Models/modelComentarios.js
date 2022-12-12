const Conn = require('../DB/connection') // Conexion a la DB
const { Message } = require('../Utils/Utils');

class Comentarios {
    __tablename = 'comentario';
    __tableUser = 'usuario'
    static #idSite;
    static #idEvents;
    static #Comentario;
    static #fechaHora;
    static #idEstado;
    static #idUsuario;

    set_idSite(idSite) {
        this.idSite = idSite;
    }
    get_idSite() {
        return this.idSite;
    }

    set_idEvents(idEvents) {
        this.idEvents = idEvents;
    }
    get_idEvents() {
        return this.idEvents;
    }

    set_Comentario(Comentario) {
        this.Comentario = Comentario;
    }
    get_Comentario() {
        return this.Comentario;
    }

    set_fechaHora(fechaHora) {
        this.fechaHora = fechaHora;
    }
    get_fechaHora() {
        return this.fechaHora;
    }

    set_idEstado(idEstado) {
        this.idEstado = idEstado;
    }
    get_idEstado() {
        return this.idEstado;
    }

    set_idUsuario(idUsuario) {
        this.idUsuario = idUsuario;
    }
    get_idUsuario() {
        return this.idUsuario;
    }

    getListComentariosByIdSite() {
        const sql = `
            SELECT C.*, U.NombreUsuario AS nameUser
            FROM ${this.__tablename} AS C
            INNER JOIN ${this.__tableUser} AS U ON C.Id_Usuario=U.Id_Usuario
            WHERE C.Id_Estado='A' && C.Id_Sitio=?;
        `;

        const data = [
            this.get_idSite(),
        ];

        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length > 0 ? res : false));
            });
        });
    }

    getListComentariosByIdEvents() {
        const sql = `
            SELECT C.*, U.NombreUsuario AS nameUser
            FROM ${this.__tablename} AS C
            INNER JOIN ${this.__tableUser} AS U ON C.Id_Usuario=U.Id_Usuario
            WHERE C.Id_Estado='A' && C.Id_Evento=?;
        `;

        const data = [
            this.get_idEvents(),
        ];

        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length > 0 ? res : false));
            });
        });
    }

    saveComentario() {
        const sql = `
            INSERT INTO ${this.__tablename}
            (Id_Comentario, Id_Sitio, Id_Evento, Comentario, Fecha_hora, Id_Estado, Id_Usuario)
            VALUES (NULL, ?, ?, ?, ?, ?, ?);
        `;

        const data = [
            this.get_idSite(),
            this.get_idEvents(),
            this.get_Comentario(),
            this.get_fechaHora(),
            this.get_idEstado(),
            this.get_idUsuario(),
        ];

        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se publico correctamente el comentario."));
            });
        });
    }
}



module.exports = Comentarios;