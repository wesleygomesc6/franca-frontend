import Periodo from "./Periodo"
import ProdutoLucroVendedor from "./ProdutoLucroVendedor";
import VendedorLucroVendedor from "./VendedorLucroVendedor";

export default class LucroVendedor {
    adesao: boolean;
    confirmacao: number;
    mensalidade: boolean;
    periodo: Periodo;
    premiacao: number;
    produto: ProdutoLucroVendedor;
    quantidadeVidas: number;
    valorAdesao: number;
    valorMensalidade: number;
    vendedor: VendedorLucroVendedor;
    codigo?: number;
    confirmacaoTotal?: number;
    premiacaoTotal?: number;

    constructor( adesao: boolean, confirmacao: number, mensalidade: boolean, periodo: Periodo, premiacao: number, produto: ProdutoLucroVendedor,
        quantidadeVidas: number, valorAdesao: number, valorMensalidade: number, vendedor: VendedorLucroVendedor,codigo?: number, confirmacaoTotal?: number, premiacaoTotal?: number) {

        this.codigo = codigo;
        this.adesao = adesao;
        this.confirmacao = confirmacao;
        this.mensalidade = mensalidade;
        this.periodo = periodo;
        this.premiacao = premiacao;
        this.produto = produto;
        this.quantidadeVidas = quantidadeVidas;
        this.valorAdesao = valorAdesao;
        this.valorMensalidade = valorMensalidade;
        this.vendedor = vendedor;
        this.confirmacaoTotal = confirmacaoTotal;
        this.premiacaoTotal = premiacaoTotal;
    }
}