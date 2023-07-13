export default class Gestora {
    codigo!: number;
    nomeGestora!: string;

    constructor(codigo: number, nomeGestora: string) {
        this.codigo = codigo;
        this.nomeGestora = nomeGestora;
    }
}