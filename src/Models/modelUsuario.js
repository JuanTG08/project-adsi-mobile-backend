class Usuario{
    static #id_usuario;
    static #nombreusuario;
    static #nombre;
    static #apellidos;
    static #telefono;
    static #email;
    static #direccion;
    static #codmunicipio;
    static #password;
    static #codigoconfirmacion;
    static #id_perfil;
    static #id_estado;
    static #genero;
    static #fecha_nac;
    static #autorizacion_td;
    static #archivo_fotografia;

    campos_db = {
        id_u: "Id_Usuario",
        nombre_u: "NombreUsuario",
        nombre: "Nombres",
        apellidos: "Apellidos",
        telefono: "Telefono",
        email: "Email",
        direccion: "Direccion",
        cod_mun: "CodMunicipio",
        password: "Password",
        cod_confirm: "CodigoConfirmacion",
        id_perfil: "Id_Perfil",
        id_estado: "Id_Estado",
        genero: "Genero",
        fec_nac: "FechaNac",
        autorizacion_td: "Autorizacion_TD",
    };

    set_id_usuario(id_usuario) {
        this.id_usuario = id_usuario;
    }
    get_id_usuario() {
        return this.id_usuario;
    }

    set_nombreusuario(nombreusuario) {
        this.nombreusuario = nombreusuario;
    }
    get_nombreusuario() {
        return this.nombreusuario;
    }

    set_nombre(nombre) {
        this.nombre = nombre;
    }
    get_nombre() {
        return this.nombre;
    }

    set_apellidos(apellidos) {
        this.apellidos = apellidos;
    }
    get_apellidos() {
        return this.apellidos;
    }

    set_telefono(telefono) {
        this.telefono = telefono;
    }
    get_telefono() {
        return this.telefono;
    }

    set_email(email) {
        this.email = email;
    }
    get_email() {
        return this.email;
    }

    set_direccion(direccion) {
        this.direccion = direccion;
    }
    get_direccion() {
        return this.direccion;
    }

    set_codmunicipio(codmunicipio) {
        this.codmunicipio = codmunicipio;
    }
    get_codmunicipio() {
        return this.codmunicipio;
    }

    set_password(password) {
        this.password = password;
    }
    get_password() {
        return this.password;
    }

    set_codigoconfirmacion(codigoconfirmacion) {
        this.codigoconfirmacion = codigoconfirmacion;
    }
    get_codigoconfirmacion() {
        return this.codigoconfirmacion;
    }

    set_id_perfil(id_perfil) {
        this.id_perfil = id_perfil;
    }
    get_id_perfil() {
        return this.id_perfil;
    }

    set_id_estado(id_estado) {
        this.id_estado = id_estado;
    }
    get_id_estado() {
        return this.id_estado;
    }

    set_genero(genero) {
        this.genero = genero;
    }
    get_genero() {
        return this.genero;
    }

    set_fecha_nac(fecha_nac) {
        this.fecha_nac = fecha_nac;
    }
    get_fecha_nac() {
        return this.fecha_nac;
    }

    set_autorizacion_td(autorizacion_td) {
        this.autorizacion_td = autorizacion_td;
    }
    get_autorizacion_td() {
        return this.autorizacion_td;
    }

    set_archivo_fotografia(archivo_fotografia) {
        this.archivo_fotografia = archivo_fotografia;
    }
    get_archivo_fotografia() {
        return this.archivo_fotografia;
    }

    get_campos_db() {
        return {
            id_u: "Id_Usuario",
            nombre_u: "NombreUsuario",
            nombre: "Nombres",
            apellido: "Apellidos",
            telefono: "Telefono",
            email: "Email",
            direccion: "Direccion",
            cod_mun: "CodMunicipio",
            password: "Password",
            cod_confirm: "CodigoConfirmacion",
            id_perfil: "Id_Perfil",
            id_estado: "Id_Estado",
            genero: "Genero",
            fec_nac: "FechaNac",
            autorizacion_td: "Autorizacion_TD",
        };
    }
}

module.exports = Usuario;