export default class VidasVendedor {

    constructor(nomeGestora, nomeProduto, nomeVendedor, totalVidas) {
        this.nomeGestora = nomeGestora;
        this.nomeProduto = nomeProduto;
        this.nomeVendedor = nomeVendedor;
        this.totalVidas = totalVidas;
    }

    static separarNomesVendedoresVidas(vidasVendedor) {
        // let nomesVendedores = [];
        // vidasVendedor.forEach(vendedor => {
        //     if(!nomesVendedores.includes(vendedor.nomeVendedor)) nomesVendedores.push(vendedor.nomeVendedor)
        // })
        // return nomesVendedores
        let nomesVendedores = [];
        vidasVendedor.forEach(vendedor => {
            if(!nomesVendedores.includes(vendedor.nomeVendedor)) nomesVendedores.push(vendedor.nomeVendedor)
        })
        return nomesVendedores

    }
    static separarNomesVendedores(vidasVendedor) {
        // let nomesVendedores = [];
        // vidasVendedor.forEach(vendedor => {
        //     if(!nomesVendedores.includes(vendedor.nomeVendedor)) nomesVendedores.push(vendedor.nomeVendedor)
        // })
        // return nomesVendedores
        let nomesVendedores = [];
        vidasVendedor.forEach(vendedor => {
            if(!nomesVendedores.includes(vendedor.vendedor.nomeVendedor)) nomesVendedores.push(vendedor.vendedor.nomeVendedor)
        })
        return nomesVendedores

    }



}