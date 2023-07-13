export default class ProdutoLucroVendedor {
    codigo?: number;
    nomeProduto!: string;
    gestora!: string;
    constructor(codigo:number, nomeProduto: string, gestora: string ) {
        this.codigo = codigo;
        this.nomeProduto = nomeProduto;
        this.gestora = gestora;
    }
}