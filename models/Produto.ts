import Gestora from "./Gestora";

export default class Produto {

  codigo?: number;
  nomeProduto!: string;
  descricaoProduto!: string;
  vitalicioAdesao!: boolean;
  vitalicioMensalidade!: boolean;
  vitalicioPorcentagem!: boolean;
  gestora!: Gestora;
  
    constructor(codigo: number, nomeProduto: string, descricaoProduto:string, vitalicioAdesao: boolean,
      vitalicioMensalidade: boolean, vitalicioPorcentagem: boolean, gestora: Gestora) {
        this.codigo = codigo;
        this.nomeProduto = nomeProduto;
        this.descricaoProduto = descricaoProduto;
        this.vitalicioAdesao = vitalicioAdesao;
        this.vitalicioMensalidade = vitalicioMensalidade;
        this.vitalicioPorcentagem = vitalicioPorcentagem;
        this.gestora = gestora;
    }
}