<template>
    <v-container class="pa-0 pa-sm-2 d-flex justify-center">
        <v-col cols="12" lg="10" xl="8">
            <h2 class="text-center">{{ titlePage }}</h2>
            <v-row class="ma-2">
                <v-col cols="12" md="4" class="pa-0">
                    <v-menu v-model="menu" :close-on-content-click="closeDatePicker" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="intervalo" label="Selecione o intervalo" v-bind="attrs" v-on="on"
                                readonly dense outlined class="mx-1"></v-text-field>
                        </template>
                        <v-date-picker range v-model="intervalo" no-title color="primary"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="4" class="pa-0">
                    <v-autocomplete class="mx-1" v-model="nomeVendedor" :items="vendedores"
                        no-data-text="Nenum vendedor encontrado" item-text="nomeVendedor" label="Nome do Vendedor"
                        hide-selected item-value="nomeVendedor" small-chips deletable-chips outlined dense
                        :search-input.sync="getVendedores" :disabled="intervaloFormatado.length < 2"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" class="pa-0">
                    <v-autocomplete class="mx-1" v-model="nomeProduto" :items="produtos"
                        no-data-text="Nenum produto encontrado" item-text="nomeProduto" label="Nome do Produto"
                        hide-selected item-value="nomeProduto" small-chips deletable-chips outlined dense
                        :search-input.sync="getProdutos" @focus="buscarProdutos(null)"
                        :disabled="intervaloFormatado.length < 2"></v-autocomplete>
                </v-col>
            </v-row>

            <v-row class="ma-2" justify="end">
                <v-btn color="warning" class="mx-1" @click="limparIntervalo()" :loading="loadingClear">LIMPAR</v-btn>
                <v-btn color="primary" @click="getVidasVendedores()" :loading="loading" :disabled="intervalo.length < 2">
                    BUSCAR
                </v-btn>
            </v-row>
            <v-skeleton-loader v-if="loading == true" type="avatar, article, article, actions"></v-skeleton-loader>

            <template v-if="nomesVendedores.length != 0">
                <v-row class="ma-2 d-block d-sm-flex" justify="center">
                    <h4>PERÍODO {{ intervaloFormatado[0] }} - {{ intervaloFormatado[1] }}</h4>
                </v-row>
                <v-card class="ma-2" v-for="vendedor  in nomesVendedores" :key="vendedor.nomeVendedor">
                    <v-card-title class="d-block accent py-1">
                        <v-row class="ma-1 px-1 text-body-1 text-sm-subtitle-1 font-weight-medium" justify="space-between">
                            <span>VENDEDOR</span>
                            <span>TOTAL VENDEDOR</span>
                        </v-row>
                        <v-row class="ma-1 px-1 text-subtitle-1" justify="space-between">
                            <span>{{ vendedor.toUpperCase() }}</span>
                            <span>{{ calcularTotalVendedor(vendedor) }}</span>
                        </v-row>
                    </v-card-title>
                    <v-card-text class="text--primary">
                        <v-row class="ma-1 px-1 font-weight-medium" justify="space-between">
                            <v-col cols="4" class="pa-0"><span> PRODUTO </span></v-col>
                            <v-col cols="4" class="pa-0 text-center"><span> GESTORA </span></v-col>
                            <v-col cols="4" class="pa-0 text-end"><span> VENDAS </span></v-col>
                        </v-row>
                        <template v-for="venda in separarProdutosVendedores(vendedor)">
                            <v-row class="ma-1 px-1">
                                <v-col cols="4" class="pa-0"><span> {{ venda.nomeProduto }} </span></v-col>
                                <v-col cols="4" class="pa-0 text-center"><span> {{ venda.nomeGestora }} </span></v-col>
                                <v-col cols="4" class="pa-0 text-end"><span> {{ venda.totalVidas }} </span></v-col>
                            </v-row>
                            <v-divider />
                        </template>
                    </v-card-text>
                </v-card>
                <v-row class="mx-2 my-4 pa-1 font-weight-bold info" justify="space-between">
                    <span>TOTAL DE VENDAS</span>
                    <span>{{ totalDeVendas }}</span>
                </v-row>
            </template>
        </v-col>
    </v-container>
</template>
  
<script>
import VidasVendedor from '@/models/VidasVendedor'
import Erros from '@/models/Erros'
export default {
    name: 'VidasVendedor',
    data() {
        return {
            titlePage: 'VIDAS VENDEDOR',
            intervalo: [],
            menu: false,
            vidasVendedor: [],
            nomesVendedores: [],
            intervaloFormatado: [],
            vendedores: [],
            produtos: [],
            totalDeVendas: 0,
            getVendedores: '',
            getProdutos: '',
            loading: false,
            loadingClear: false,
            nomeProduto: '',
            nomeVendedor: ''
        }
    },
    watch: {
        intervalo(val) {
            if (val.length == 1) this.intervaloFormatado[0] = this.formatDate(val[0])
            if (val.length == 2) this.intervaloFormatado[1] = this.formatDate(val[1])
        },
        getVendedores(val) {
            if (val != null) {
                if (val.length == 1) {
                    this.buscarVendedores(val)
                }

            }
        },
        getProdutos(val) {
            if (val != null) {
                if (val.length == 1) {
                    this.buscarProdutos(val)
                }

            }
        }
    },
    computed: {
        closeDatePicker() {
            return this.intervalo.length >= 2 ? true : false
        }
    },
    methods: {
        getVidasVendedores() {
            this.loading = true;
            let url = '';
            if (!this.nomeVendedor && !this.nomeProduto) {
                url = `franca/relatorios/vidas?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}`

            } else if (this.nomeProduto && !this.nomeVendedor) {
                url = `franca/relatorios/vidas?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeProduto=${this.nomeProduto}`

            } else if (!this.nomeProduto && this.nomeVendedor) {
                url = `franca/relatorios/vidas?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeVendedor=${this.nomeVendedor}`

            } else {
                url = `franca/relatorios/vidas?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeProduto=${this.nomeProduto}&nomeVendedor=${this.nomeVendedor}`

            }

            this.$axios.$get(url)
                .then(res => {
                    if (res.length == 0) {
                        this.$snotify.warning('Nenhum registro encontrado com esses parâmetros.', 'Revise os dados')
                    }
                    this.vidasVendedor = res
                    this.separarVendedores()
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                })
            this.loading = false
        },
        buscarVendedores(nomeVendedor) {
            this.$axios.$get(`franca/vendedores?nomeVendedor=${nomeVendedor}`)
                .then(res => {
                    if (res.length == 0) {
                        this.$snotify.warning('Nenhum registro encontrado com esses parâmetros.', 'Revise os dados')
                    } this.vendedores = res.content
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                })
        },
        buscarProdutos(nomeProduto) {
            let url = '';
            if (nomeProduto == null) {
                url = `franca/produtos/info?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}`
            } else {
                url = `franca/produtos/info?nomeProduto=${nomeProduto}&periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}`
            }
            this.$axios.$get(url)
                .then(res => {
                    if (res.length == 0) {
                        this.$snotify.warning('Nenhum registro encontrado com esses parâmetros.', 'Revise os dados')
                    } this.produtos = res.content
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                })
        },
        separarVendedores() {
            this.nomesVendedores = VidasVendedor.separarNomesVendedoresVidas(this.vidasVendedor)
            this.calcularTotalVendas()
        },
        separarProdutosVendedores(nome) {
            let vendasVendedor = [];
            this.vidasVendedor.forEach(element => {
                if (element.nomeVendedor === nome) {
                    vendasVendedor.push(element)
                }
            })
            return vendasVendedor;
        },

        calcularTotalVendas() {
            this.totalDeVendas = this.vidasVendedor.map(el => el.totalVidas).reduce((accumulator, value) => accumulator + value, 0)
        },
        calcularTotalVendedor(nome) {
            const valores = this.vidasVendedor.map(v => v.nomeVendedor === nome ? v.totalVidas : 0)
            return valores.reduce((accumulator, value) => accumulator + value, 0)
        },

        limparIntervalo() {
            this.loadingClear = true;
            this.intervalo = [];
            this.intervaloFormatado = [];
            this.vidasVendedor = [];
            this.nomesVendedores = [];
            this.nomeProduto = '';
            this.nomeVendedor = ''
            this.loadingClear = false;
        },
        formatDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        }

    }
}
</script>
  