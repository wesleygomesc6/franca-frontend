export default class LucroVendedor {

    constructor(cpfVendedor, nomeVendedor, nomeProduto, nomeGestora, totalConfirmacaoVendedor, totalPremiacaoVendedor) {
        this.cpfVendedor = cpfVendedor;
        this.nomeVendedor = nomeVendedor;
        this.nomeProduto = nomeProduto;
        this.nomeGestora = nomeGestora;
        this.totalConfirmacaoVendedor = totalConfirmacaoVendedor;
        this.totalPremiacaoVendedor = totalPremiacaoVendedor
    }

    static calcularTotalPremiacaoEConfirmacaoVendedor(dados, nomeVendedor, parametroAcalcular) {
        if (parametroAcalcular === 'totalConfirmacao') {
            return dados.filter(element => element.vendedor.nomeVendedor === nomeVendedor).map(el => el.confirmacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
                { style: 'currency', currency: 'BRL' })
        } else {
            return dados.filter(element => element.vendedor.nomeVendedor === nomeVendedor).map(el => el.premiacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
                { style: 'currency', currency: 'BRL' })
        }
    }

    static calcularLucroVendedor(dados, vendedor) {
        return dados.filter(element => element.vendedor.nomeVendedor === vendedor).map(el => el.confirmacaoTotal + el.premiacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
            { style: 'currency', currency: 'BRL' })
    }
}

