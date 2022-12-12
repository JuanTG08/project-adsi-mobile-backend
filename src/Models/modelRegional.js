const Conn = require('../DB/connection') // Conexion a la DB
class Departamentos{
    tableDept = 'departamento';
    tableMunicipio = 'municipio';
    static #codDpto;
    static #nombreDpto;
    static #codCapital;

    setcodDpto(codDpto) {
        this.codDpto = codDpto;
    }
    getcodDpto() {
        return this.codDpto;
    }

    getListDepartamentos() {
        return new Promise((resolve) => {
            Conn.query(`SELECT * FROM ${this.tableDept}`,
                (err, rows) => {
                    if (err) resolve(false);
                    else resolve(rows);
                });
        });
    }

    getListMunicipios(codDept) {
        return new Promise((resolve) => {
            Conn.query(`SELECT * FROM ${this.tableMunicipio} WHERE codDepto=?`, [codDept],
                (err, rows) => {
                    if (err) resolve(false);
                    else resolve(rows);
                });
        });
    }
}

module.exports = Departamentos;

