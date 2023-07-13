import Cliente from "./Cliente";
import Periodo from "./Periodo";
import Produto from "./Produto";
import Usuario from "./Usuario";
import VendedorLucroVendedor from "./VendedorLucroVendedor";

export default class Venda {
    
    periodo!:Periodo;
    produto!: Produto;
    vendedor!: VendedorLucroVendedor;
    cliente!: Cliente;
    idVenda!:string;
    adesaoIsenta!: boolean;
    valorAdesao!: number;
    quantidadeVidas!: number;
    valorMensalidade!: number;
    vigencia!: Date;
    leadName!: string;
    valorLead!: number;
    observacoes!: string;
    quantidadeParcelas!: number;
    parcelas!: any[];
    usuarioCadastro!: Usuario;
    codigo?: number;

    constructor(periodo:Periodo, cliente:Cliente, produto:Produto, vendedor:VendedorLucroVendedor, 
        usuarioCadastro: Usuario, adesaoIsenta:boolean, idVenda:string, leadName: string, observacoes:string, quantidadeParcelas: number,
        quantidadeVidas:number, valorAdesao:number, valorLead:number, valorMensalidade:number, vigenia:Date,
        parcelas: any[], codigo?: number) {
            this.periodo = periodo;
            this.cliente = cliente;
            this.produto = produto;
            this.vendedor = vendedor;
            this.usuarioCadastro = usuarioCadastro;
            this.adesaoIsenta = adesaoIsenta;
            this.idVenda = idVenda;
            this.leadName = leadName;
            this.observacoes = observacoes;
            this.quantidadeVidas = quantidadeVidas;
            this.valorAdesao = valorAdesao;
            this.valorLead = valorLead;
            this.valorMensalidade = valorMensalidade;
            this.vigencia = vigenia;
            this.quantidadeParcelas = quantidadeParcelas;
            this.parcelas = parcelas;
            this.codigo = codigo;

    }
}



