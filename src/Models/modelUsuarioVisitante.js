const Conn = require('../DB/connection') // Conexion a la DB

const UsuarioModel = require('./modelUsuario');
const { Message } = require('../Utils/Utils');

class modelUsuarioVisitante extends UsuarioModel {
    __tableName = "usuario";

    constructor() {
        super();
    }
    
    // Se crea el usuario pero con el estado de Confirmacion
    createUserVisitante() {
        const sql = `INSERT INTO ${this.__tableName}
            (
                ${this.campos_db.nombre_u},
                ${this.campos_db.nombre},
                ${this.campos_db.apellidos},
                ${this.campos_db.telefono},
                ${this.campos_db.email},
                ${this.campos_db.direccion},
                ${this.campos_db.cod_mun},
                ${this.campos_db.password},
                ${this.campos_db.cod_confirm},
                ${this.campos_db.id_perfil},
                ${this.campos_db.id_estado},
                ${this.campos_db.genero},
                ${this.campos_db.fec_nac},
                ${this.campos_db.autorizacion_td}
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
        const data = [
            this.get_nombreusuario(),
            this.get_nombre(),
            this.get_apellidos(),
            this.get_telefono(),
            this.get_email(),
            this.get_direccion(),
            this.get_codmunicipio(),
            this.get_password(),
            this.get_codigoconfirmacion(),
            this.get_id_perfil(),
            this.get_id_estado(),
            this.get_genero(),
            this.get_fecha_nac(),
            this.get_autorizacion_td(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos.", err));
                resolve(Message(false, 200, "Ok"));
            });
        });
    }

    // Se Verifica el usuario que exista mediante el Correo
    verifyUserByMail() {
        const sql = `SELECT id_usuario FROM ${this.__tableName} WHERE ${this.campos_db.email}=?;`;
        const data = [
            this.get_email()
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length > 0 /* Se comprueba que este el registro */));
            });
        });
    }

    // Se Verifica el usuario que exista mediante el Correo y/o Usuario
    verifyUserByMailOrUsername() {
        const sql = `SELECT id_usuario FROM ${this.__tableName} WHERE ${this.campos_db.email}=? OR ${this.campos_db.nombre_u}=?;`;
        const data = [
            this.get_email(),
            this.get_nombreusuario(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res.length > 0 /* Se comprueba que este el registro */));
            });
        });
    }

    verifyUserByMailAndUsernameAndActive() {
        const sql = `SELECT * FROM ${this.__tableName} WHERE ${this.campos_db.email}=? AND ${this.campos_db.nombre_u}=? AND ${this.campos_db.id_estado}='A';`;
        const data = [
            this.get_email(),
            this.get_nombreusuario(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res));
            });
        });
    }

    // Se Verifica el usuario que exista mediante el Correo y coincida con su codigo de confirmación, y a su vez el estado coincida.
    verifyUserByMailAndCodeConfirmation() {
        const sql = `SELECT id_usuario FROM ${this.__tableName} WHERE ${this.campos_db.email}=? AND ${this.campos_db.cod_confirm}=? AND ${this.campos_db.id_estado}='C'`;
        const data = [
            this.get_email(),
            this.get_codigoconfirmacion(),
        ]
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                // JSON.parse(JSON.stringify(res[0]))
                resolve(Message(false, 200, "Ok", res.length > 0));
            });
        });
    }

    // Se borra el codigo de confirmación de la tabla usuario.
    setCodeConfirmNull() {
        const sql = `UPDATE ${this.__tableName} SET ${this.campos_db.cod_confirm}=NULL WHERE ${this.campos_db.email}=?`;
        const data = [
            this.get_email(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se convirtio en NULL el campo de codigo de confirmacion."));
            });
        });
    }

    // Se actualiza el estado del usuario
    uploadStatusOfUser() {
        const sql = `UPDATE ${this.__tableName} SET id_estado='A' WHERE email=?`;
        const data = [
            this.get_email(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Tu cuenta se encuentra activa!"));
            });
        });
    }

    // Se realiza el Inicio de Sesion, se trae el Usuario de tipo Visitante mediante el Mail
    getUserVisitanteByMail() {
        const sql = `SELECT * FROM ${this.__tableName} WHERE ${this.campos_db.email}=? AND ${this.campos_db.id_perfil}='VIS' AND ${this.campos_db.id_estado}='A';`;
        const data = [
            this.get_email(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                const responseUser = res != undefined ? res[0] : false;
                resolve(Message(false, 200, "Ok", responseUser));
            });
        });
    }

    verifyIsAuthenticatedUser() { // Se verifica la autentificacion del usuario
        const sql = `
            SELECT *
            FROM ${this.__tableName}
            WHERE ${this.campos_db.id_u}=? AND ${this.campos_db.email}=? AND ${this.campos_db.password}=?;
        `;
        const data = [
            this.get_id_usuario(),
            this.get_email(),
            this.get_password(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Ok", res[0]));
            });
        });
    }

    uploadDataUser(sqlSetData, data) { // Se actualiza la informacion del Usuario en cuestión
        const sql = `
            UPDATE ${this.__tableName}
            SET ${sqlSetData} 
            WHERE ${this.campos_db.id_u}=?;
        `;
        data.push(this.get_id_usuario());
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se actualizo correctamente el usuario"));
            });
        });
    }
    
    uploadCodeConfirmUser(codeConfirm) {
        const sql = `UPDATE ${this.__tableName} SET ${this.campos_db.cod_confirm}=? WHERE ${this.campos_db.email}=?`;
        const data = [
            codeConfirm,
            this.get_email(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se actualizo correctamente codigo de confirmación del usuario."));
            });
        });
    }

    verifyCodeConfirmByMail() { // Verifica el codigo de confirmacion mediante el email y su codigo
        const sql = `SELECT ${this.campos_db.id_u} FROM ${this.__tableName} WHERE ${this.campos_db.email}=? AND ${this.campos_db.cod_confirm}=? AND ${this.campos_db.id_estado}='A'`;
        const data = [
            this.get_email(),
            this.get_codigoconfirmacion(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se encontro correctamente el usuario con su codigo!", res.length > 0));
            });
        });
    }

    uploadPasswordByMail() { // Actualizamos la contraseña
        const sql = `UPDATE ${this.__tableName} SET password=? WHERE ${this.campos_db.email}=? AND ${this.campos_db.id_estado}='A'`;
        const data = [
            this.get_password(),
            this.get_email(),
            this.get_codigoconfirmacion(),
        ];
        return new Promise(resolve => {
            Conn.query(sql, data, (err, res) => {
                if (err) resolve(Message(true, 701, "Error en la transferencia de datos."));
                resolve(Message(false, 200, "Se actualizo correctamente tu contraseña."));
            });
        });
    }
}

module.exports = modelUsuarioVisitante;