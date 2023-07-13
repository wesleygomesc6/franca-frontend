import Usuario from "./Usuario";

export default class Cliente {

    codigo?: number;
    cpf?: string;
    cnpj?: string;
    nomeCompleto?: string;
    dataNascimento?:Date;
    cpfResponsavel?: string;
    nomeResposavel?: string;
    usuarioRegistro?: Usuario;

    constructor( nomeCompleto?:string, dataNascimento?:Date, usuarioRegistro?:Usuario, codigo?: number,cpf?:string,
         cnpj?:string,cpfResponsavel?: string, nomeResponsavel?:string) {
            this.cpf = cpf;
            this.cnpj = cnpj;
            this.nomeCompleto = nomeCompleto;
            this.dataNascimento = dataNascimento;
            this.cpfResponsavel = cpfResponsavel;
            this.nomeResposavel = nomeResponsavel;
            this.usuarioRegistro = usuarioRegistro;
            this.codigo = codigo;
        }
}