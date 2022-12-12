const Conn = require('../DB/connection') // Conexion a la DB
const { Message } = require('../Utils/Utils');

class Calificacion {
    __tablenameEvent = 'calificacion_evento';
    static #idUsuario;
    static #idEvent;
    static #idSitio;
    static #calificacion;
    static #visitas;

    set_idUsuario(idUsuario) {
        this.idUsuario = idUsuario;
    }
    get_idUsuario() {
        return this.idUsuario;
    }

    set_idEvent(idEvent) {
        this.idEvent = idEvent;
    }
    get_idEvent() {
        return this.idEvent;
    }

    set_idSitio(idSitio) {
        this.idSitio = idSitio;
    }
    get_idSitio() {
        return this.idEvent;
    }

    set_Calificacion(calificacion) {
        this.calificacion = calificacion;
    }
    get_Calificacion() {
        return this.calificacion;
    }

    set_Visitas(visitas) {
        this.visitas = visitas;
    }
    get_Visitas() {
        return this.visitas;
    }

    saveCalificationOfEvent() {
        const sql = `
            
        `;
    }
}

module.exports = Calificacion;