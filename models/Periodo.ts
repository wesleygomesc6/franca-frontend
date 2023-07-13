import Produto from "./Produto";

export default class Periodo {
    codigo?: number;
    periodoInicial: Date;
    periodoFinal: Date;
    produtos: Produto[];

    constructor( periodoInicial: Date, periodoFinal: Date, produtos: any[], codigo?: number) {
        this.periodoInicial = periodoInicial;
        this.periodoFinal = periodoFinal;
        this.produtos = produtos;
        this.codigo = codigo;
    }
}