export default class Parcela {
    constructor(cod, cpfVendedor, dataPagamento, idProduto, idVenda, paga, periodoFinal, periodoInicial, porcentagem,
        quantidadeParcelas, valorBase, valorParcela, valorTotal, vendedor,) {
        this.cod = cod
        this.cpfVendedor = cpfVendedor
        this.dataPagamento = dataPagamento
        this.idProduto = idProduto
        this.idVenda = idVenda
        this.paga = paga
        this.periodoFinal = periodoFinal
        this.periodoInicial = periodoInicial
        this.porcentagem = porcentagem
        this.quantidadeParcelas = quantidadeParcelas
        this.valorBase = valorBase
        this.valorParcela = valorParcela
        this.valorTotal = valorTotal
        this.vendedor = vendedor
    }

}
