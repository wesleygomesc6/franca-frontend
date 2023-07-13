export default class VendedorLucroVendedor {
    codigo?: number;
    nomeVendedor?: string;
    constructor(codigo: number, nomeVendedor?: string) {
        this.codigo = codigo;
        this.nomeVendedor = nomeVendedor;
    }
}