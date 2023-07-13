export default class Usuario {
    codigo?: number;
    nomeCompleto: string;
    acesso: AcessoUsuario;

    constructor(nomeCompleto:string, acesso: AcessoUsuario, codigo?: number) {
        this.nomeCompleto = nomeCompleto;
        this.acesso = acesso;
        this.codigo = codigo;
    }
}