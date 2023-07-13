<template>
    <v-row class="ma-2 d-block">
        <v-row class="ma-1" justify="center">
            <h2>{{ title }}</h2>
        </v-row>
        <v-row class="ma-1" justify="center">
            <v-col cols="12" sm="6" class="d-flex">
                <v-autocomplete label="Selecione o intervalo" outlined dense :items="periodos" item-text="intervalo"
                    item-value="codigo" v-model="periodo" clearable @click:clear="parametros = []" @focus="getIntervalos()">
                    <template v-slot:item="{item}">
                        <template>
                            <v-list-item-content :class="{'accent' : item.mesAtual == true}">
                                <v-list-item-title v-html="item.intervalo"></v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </template>
                </v-autocomplete>
                <v-btn color="primary" @click="getParametros(periodo)" class="mx-1" :loading="loadingSearch"> Buscar
                    <v-icon>mdi-magnify</v-icon></v-btn></v-col>
        </v-row>
        <v-col cols="12" class="pa-0 pa-sm-2">
            <template v-for="(vendedor, index) in vendasAgrupadasVendedores">
                <v-data-table dense :headers="headers" :items="vendedor.vendas" hide-default-footer
                    class="elevation-2 my-4">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-row justify="space-between" align-conten="center" class="ma-1">
                                <span class="text-h6">{{ vendedor.nome }}</span>

                                <v-btn color="primary" @click="salvarLucroVendedor(vendedor.vendas)" :loading="loading"
                                    :disabled="desabilitar">SALVAR</v-btn>
                            </v-row>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.premiacao="{ item }">
                        <v-text-field type="number" dense v-model="item.premiacao" clearable
                            hint="Informe a premiacao"></v-text-field>
                    </template>
                    <template v-slot:item.confirmacao="{ item }">
                        <v-text-field type="number" dense v-model="item.confirmacao" clearable
                            hint="Informe a confirmacao  "></v-text-field>
                    </template>
                    <template v-slot:item.adesao="{ item }">
                        <v-checkbox label="Adesão" class="mx-1" v-model="item.adesao"></v-checkbox>
                    </template>
                    <template v-slot:item.mensalidade="{ item }">
                        <v-checkbox label="Mensalidade" class="mx-1 " v-model="item.mensalidade"></v-checkbox>
                    </template>
                    <template v-slot:item.acoes="{ item }">
                        <v-btn text small><v-icon color="warning" title="Editar">mdi-square-edit-outline</v-icon></v-btn>
                    </template>
                </v-data-table>
            </template>
        </v-col>
    </v-row>
</template>
<script>
import LucroVendedor from '~/models/LucroVendedor.ts';
import Periodo from '~/models/Periodo';
import ProdutoLucroVendedor from '~/models/ProdutoLucroVendedor';
import VendedorLucroVendedor from '~/models/VendedorLucroVendedor';
export default {
    name: 'Parametrização',
    data() {
        return {
            title: 'PARAMETRIZAÇÃO',
            valid: true,
            loading: false,
            loadingSearch: false,
            desabilitar: false,
            parametros: [],
            periodos: [],
            periodo: 0,
            teste: {},
            headers: [
                { text: 'NOME PRODUTO', value: 'nomeProduto' },
                { text: 'NOME GESTORA', value: 'nomeGestora' },
                { text: 'QTD VIDAS', value: 'quantidadeVidas' },
                { text: 'PREMIAÇÃO', value: 'premiacao' },
                { text: 'CONFIRMAÇÃO', value: 'confirmacao' },
                { text: 'ADESÃO', value: 'adesao' },
                { text: 'MENSALIDADE', value: 'mensalidade' },
                { text: 'AÇÕES', value: 'acoes' }
            ]
        }
    },
    computed: {
        vendasAgrupadasVendedores() {
            let vendasVendedores = [];

            // Separa os nomes dos vendedores sem repetições
            let nomesVendedores = []
            this.parametros.map(vendas => {
                if (!nomesVendedores.includes(vendas.nomeVendedor)) nomesVendedores.push(vendas.nomeVendedor)
            })

            // Separa as vendas por vendedores
            nomesVendedores.forEach(nome => {
                let vendaVendedor = [];
                let vendas = []
                this.parametros.filter(venda => {
                    if (venda.nomeVendedor == nome) vendaVendedor.push(venda)
                    vendas.push(venda)
                })
                vendasVendedores.push({ nome: nome, vendas: vendaVendedor })
            })

            return vendasVendedores
        },
    },
    methods: {
        verificarMesAtual(intervalo) {
            let mesAtual = (new Date().getMonth() + 1);
            const mesIntervalo = intervalo.split('/')[3];

            if(mesAtual < 10) mesAtual = '0'+mesAtual;

            if(mesAtual === mesIntervalo) return true;

            return false;

        },
        getIntervalos() {
            this.loadingSearch = true;
            this.$axios.$get(`franca/periodos/listar-todos`)
                .then(res => {
                    this.periodos = res.content.map(({ codigo, periodoInicial, periodoFinal }) => 
                    ({ codigo: codigo, intervalo: `${periodoInicial} a ${periodoFinal}`, mesAtual : this.verificarMesAtual(`${periodoInicial} a ${periodoFinal}`) }))
                })
                .catch(erro => {
                    this.$snotify.warning(erro, 'Erro!')
                })
            this.loadingSearch = false
        },
        getParametros(codigoPeriodo) {
            this.loadingSearch = true;
            this.$axios.$get(`franca/relatorios/lucro?codigoPeriodo=${codigoPeriodo}`)
                .then(res => {
                    if(res.content != 0) {
                        this.parametros = res.content
                    } else {
                        this.$snotify.info('Nenhuma venda disponivel para parametrizar neste período!')
                    }
                    
                })
                .catch(erro => {
                    this.$snotify.warning(erro, 'Erro.')
                })
            this.loadingSearch = false;
        },
        salvarLucroVendedor(vendedor) {
            this.loading = true;
            let lucros = [];
            vendedor.forEach((element) => {
                const periodo = new Periodo(null, null, null, element.codigoPeriodo);
                const produto = new ProdutoLucroVendedor(element.codigoProduto);
                const vendedor = new VendedorLucroVendedor(element.codigoVendedor);
                let lucroVendedor = new LucroVendedor(element.adesao, element.confirmacao, element.mensalidade, periodo, element.premiacao,
                    produto, element.quantidadeVidas, element.valorAdesao, element.valorMensalidade, vendedor);
                lucros.push(lucroVendedor);

            })
            this.$axios.$post(`franca/lucro-vendedores`, lucros)
                .then(res => {
                    this.$snotify.success('Salvo com sucesso!', 'Ok');
                    // this.loading = false;
                    this.getParametros(this.periodo)
                })
                .catch(err => {
                    this.$snotify.warning(err, 'Erro!');
                })
            this.loading = false;
        }
    }
}
</script>