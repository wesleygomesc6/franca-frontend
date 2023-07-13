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
                        :search-input.sync="getProdutos" @focus="buscarProdutos(null)" :disabled="intervaloFormatado.length < 2"></v-autocomplete>
                </v-col>
            </v-row>
            <v-row class="ma-2" justify="end">
                <v-btn color="warning" class="mx-1" @click="limparIntervalo()" :loading="loadingClear">LIMPAR</v-btn>
                <v-btn color="primary" @click="getLucroVendedores()" :loading="loading" :disabled="intervalo.length < 2">
                    BUSCAR </v-btn>
            </v-row>
            <template v-if="nomesVendedores != 0">
                    <v-row class="ma-2 d-block d-sm-flex" justify="center">
                        <h3>PERÍODO {{ intervaloFormatado[0] }} - {{ intervaloFormatado[1] }}</h3>
                    </v-row>
                    <v-card class="ma-2" v-for="(vendedor, i)  in nomesVendedores" :key="i">
                        <v-card-title class="d-block accent py-2">
                            <v-row class="ma-1 px-1 text-subtitle-1" justify="space-between">
                                <span>{{ vendedor.toUpperCase() }}</span>
                            </v-row>
                        </v-card-title>
                        <v-card-text class="text--primary">
                            <v-row class="ma-1 px-1 font-weight-medium" justify="space-between">
                                <v-col cols="3" class="pa-0"><span> PRODUTO </span></v-col>
                                <v-col cols="2" class="pa-0 text-center"><span> GESTORA </span></v-col>
                                <v-col cols="2" class="pa-0 text-center"><span> PREMIAÇÃO </span></v-col>
                                <v-col cols="3" class="pa-0 text-center"><span> CONFIRMAÇÃO </span></v-col>
                                <v-col cols="2" class="pa-0 text-end"><span> TOTAL </span></v-col>
                            </v-row>
                            <v-row class="ma-1 px-1" v-for="(lucro, i) in separarProdutosVendedores(vendedor)" :key="i">
                                <v-col cols="3" class="pa-0"><span> {{ lucro.produto.nomeProduto }} </span></v-col>
                                <v-col cols="2" class="pa-0 text-center"><span> {{ lucro.produto.gestora.nomeGestora }}
                                    </span></v-col>
                                <v-col cols="2" class="pa-0 text-center"><span>
                                        {{ lucro.premiacaoTotal }}
                                    </span>
                                </v-col>
                                <v-col cols="3" class="pa-0 text-center"><span>
                                        {{ lucro.confirmacaoTotal }}
                                    </span>
                                </v-col>
                                <v-col cols="2" class="pa-0 text-end"><span> {{ lucro.confirmacaoTotal +
                                    lucro.premiacaoTotal }} </span></v-col>

                            </v-row>
                            <v-divider />
                            <v-row class="ma-2 pa-1 font-weight-medium text-body-2" justify="space-between">
                                <v-col cols="5" class="pa-0"><span> TOTAL VENDEDOR</span></v-col>
                                <v-col cols="2" class="pa-0 text-center"><span>
                                        {{ calcularTotalPremiacaoEConfirmacaoVendedor(vendedor, 'totalPremiacao') }}
                                    </span></v-col>
                                <v-col cols="3" class="pa-0 text-center"><span> {{
                                    calcularTotalPremiacaoEConfirmacaoVendedor(vendedor, 'totalConfirmacao') }}
                                    </span></v-col>
                                <v-col cols="2" class="pa-0 text-end"><span>{{ calcularLucroVendedor(vendedor)
                                }}</span></v-col>
                            </v-row>
                        </v-card-text>

                    </v-card>
                    <v-row class="mx-2 my-4 pa-1 font-weight-bold info" justify="space-between">
                        <v-col cols="5" class="pa-0"><span> VALOR TOTAL </span></v-col>
                        <v-col cols="2" class="pa-0 text-center"><span> {{ calcularTotalPremiacao() }} </span></v-col>
                        <v-col cols="3" class="pa-0 text-center"><span> {{ calcularTotalConfirmacao() }} </span></v-col>
                        <v-col cols="2" class="pa-0 text-end"><span> {{ valorTotal }} </span></v-col>
                    </v-row>
            </template>
        </v-col>
    </v-container>
</template>
  
<script>
import LucroVendedor from '@/models/LucroVendedor'
import VidasVendedor from '@/models/VidasVendedor'
import Erros from '@/models/Erros'
export default {
    name: 'LucroVendedor',
    data: (vm) => ({
        titlePage: 'LUCRO VENDEDOR',
        intervalo: [],
        menu: false,
        lucroVendedores: [],
        nomesVendedores: [],
        intervaloFormatado: [],
        vendedores: [],
        produtos: [],
        expanded: [],
        valorTotal: 0,
        loading: false,
        loadingClear: false,
        getVendedores: '',
        getProdutos: '',
        nomeProduto: '',
        nomeVendedor: '',
    }),
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
        getLucroVendedores() {
            this.loading = true;
            let url = '';
            if (!this.nomeVendedor && !this.nomeProduto) {
                url = `franca/lucro-vendedores/periodo?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}`
            } else if (this.nomeProduto && !this.nomeVendedor) {
                url = `franca/lucro-vendedores/periodo?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeProduto=${this.nomeProduto}`
            } else if (!this.nomeProduto && this.nomeVendedor) {
                url = `franca/lucro-vendedores/periodo?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeVendedor=${this.nomeVendedor}`
            } else {
                url = `franca/lucro-vendedores/periodo?periodoInicial=${this.intervaloFormatado[0]}&periodoFinal=${this.intervaloFormatado[1]}&nomeProduto=${this.nomeProduto}&nomeVendedor=${this.nomeVendedor}`
            }

            this.$axios.$get(url)
                .then(res => {
                    if (res.length == 0) {
                        this.$snotify.warning('Nenhum registro encontrado com esses parâmetros.', 'Revise os dados')
                    }
                    this.lucroVendedores = res.content
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
            if(nomeProduto == null) {
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
            this.nomesVendedores = VidasVendedor.separarNomesVendedores(this.lucroVendedores)
            this.calcularValorTotal()
        },
        separarProdutosVendedores(nome) {
            let lucroVendedor = [];
            this.lucroVendedores.forEach(element => {
                if (element.vendedor.nomeVendedor === nome) {
                    lucroVendedor.push(element)
                }
            })
            return lucroVendedor;
        },
        calcularValorTotal() {
            this.valorTotal = this.lucroVendedores.map(el => el.confirmacaoTotal +
                el.premiacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
                    { style: 'currency', currency: 'BRL' })
        },
        calcularTotalPremiacaoEConfirmacaoVendedor(vendedor, parametro) {
            return LucroVendedor.calcularTotalPremiacaoEConfirmacaoVendedor(this.lucroVendedores, vendedor, parametro)
        },
        calcularLucroVendedor(vendedor) {
            return LucroVendedor.calcularLucroVendedor(this.lucroVendedores, vendedor)
        },
        calcularTotalPremiacao() {
            return this.lucroVendedores.map(el => el.premiacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
                { style: 'currency', currency: 'BRL' })
        },
        calcularTotalConfirmacao() {
            return this.lucroVendedores.map(el => el.confirmacaoTotal).reduce((accumulator, value) => accumulator + value, 0).toLocaleString('pt-br',
                { style: 'currency', currency: 'BRL' })
        },


        limparIntervalo() {
            this.loadingClear = true;
            this.intervalo = [];
            this.intervaloFormatado = [];
            this.lucroVendedores = [];
            this.nomesVendedores = []
            this.nomeProduto = '';
            this.nomeVendedor = '';
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
  