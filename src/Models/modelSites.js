const Conn = require('../DB/connection') // Conexion a la DB
const { Message } = require('../Utils/Utils');

class Sites {
    __tablename = 'sitio';
    __tablenameFoto = 'fotografia';
    _tableCarrouselSite = 'carruselfoto_sitio';
    static #idSite;

    set_idSite(idSite) {
        this.idSite = idSite;
    }
    get_idSite() {
        return this.idSite;
    }

    listAllSites(zone) {
        const sql = `
            SELECT S.Id_Sitio, S.Nombre, S.Descripcion, S.Calificacion, F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this.__tablename} AS S
            INNER JOIN ${this.__tablenameFoto} AS F ON S.Id_FotoPrincipal=F.Id_Fotografia
            WHERE F.Id_Estado='A' AND S.Zona_APT='${zone}' AND S.Id_Estado='A'
            ORDER BY S.Nombre ASC;
        `;

        return new Promise(resolve => {
            Conn.query(sql, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length ? res : false));
            });
        });
    }

    listTopSites(zone, limit = 5) {
        const sql = `
            SELECT S.Id_Sitio, S.Nombre, S.Descripcion, S.Calificacion, F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this.__tablename} AS S
            INNER JOIN ${this.__tablenameFoto} AS F ON S.Id_FotoPrincipal=F.Id_Fotografia
            WHERE F.Id_Estado='A' AND S.Zona_APT='${zone}' AND S.Id_Estado='A'
            ORDER BY S.Calificacion DESC
            LIMIT ${limit};
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
            SELECT S.Id_Sitio, S.Nombre, S.Descripcion, S.Calificacion, F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this.__tablename} AS S
            INNER JOIN ${this.__tablenameFoto} AS F ON S.Id_FotoPrincipal=F.Id_Fotografia
            WHERE F.Id_Estado='A' AND S.Id_Sitio=? AND S.Id_Estado='A';
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

    getAllImagesForSite() {
        const sql = `
            SELECT F.Archivo_Foto AS url_foto, F.Id_Cuenta AS carpeta
            FROM ${this._tableCarrouselSite} AS CS
            INNER JOIN ${this.__tablenameFoto} AS F ON CS.Id_Fotografía=F.Id_Fotografia
            WHERE CS.Id_Estado='A' AND CS.Id_Sitio=?;
        `;
        const data = [
            this.get_idSite(),
        ];

        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos.", err));
                resolve(Message(false, 200, "Ok", res.length > 0 ? res : false));
            });
        });
    }
}



module.exports = Sites;