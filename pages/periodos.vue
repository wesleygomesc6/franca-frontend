<template>
    <v-col cols="12" md="8">
        <v-skeleton-loader v-if="loadingTable" type="article, article, article"></v-skeleton-loader>
        <template v-else>
            <v-row justify="space-between" class="mx-2 my-4">
                <h2>{{ titlePage }}</h2>
                <v-dialog v-model="dialog" max-width="600px" persistent>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" title="Novo Período" v-bind="attrs" v-on="on" :loading="loading"><span
                                class="d-none d-sm-flex">NOVO
                                PERIODOS
                            </span>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <Cadastro :modeloCadastro="periodo" :tituloFormulario="tituloFormulario"
                        @fechar-dialogo="dialog = false" @atualizar-dados="getPeriodos"/>
                </v-dialog>
            </v-row>
            <v-data-table :headers="headers" :items="periodos" class="elevation-1" hide-default-footer
                :page.sync="paginacao.pageNumber" :items-per-page.sync="paginacao.pageSize" show-expand
                :expanded.sync="expanded" item-key="codigo" single-expand no-data-text="Nenhum período encontrado.">
                <template v-slot:item.qtdProdutos="{ item }">
                    {{ item.produtos.length }}
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                        <v-row class="ma-2 d-flex" no-gutters>
                    <th>PRODUTOS:</th>
                    </v-row>
                    <v-row class="ma-2 d-flex font-weight-medium" no-gutters>
                        <v-col cols="12" sm="3">
                            <span>CODIGO:</span>
                        </v-col>
                        <v-col cols="12" sm="5">
                            <span>NOME:</span>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <span>GESTORA:</span>
                        </v-col>
                    </v-row>
                    <template v-for="produto in item.produtos">
                        <v-row class="ma-2 d-flex" no-gutters>
                            <v-col cols="12" sm="3">
                                {{ produto.codigo }}
                            </v-col>
                            <v-col cols="12" sm="5">
                                {{ produto.nomeProduto }}
                            </v-col>
                            <v-col cols="12" sm="4">
                                {{ produto.gestora.nomeGestora }}
                            </v-col>
                        </v-row>
                        <v-divider />
                    </template>
                    </td>
                </template>
                <template v-slot:footer>
                    <Paginacao :paginacao="paginacao" @paginacao="paged" />
                </template>
            </v-data-table>
        </template>
    </v-col>
</template>
  
<script>
import Periodo from '@/models/Periodo.ts'
import Erros from '@/models/Erros'
export default {
    data() {
        return {
            titlePage: 'PERÍODOS',
            loading: false,
            loadingTable: false,
            periodo: new Periodo(),
            tituloFormulario: 'CADASTRAR NOVO PERÍODO',
            dialog: false,
            expanded: [],
            headers: [
                { text: 'CODIGO', value: 'codigo' },
                { text: 'PERÍODO INICIAL', value: 'periodoInicial' },
                { text: 'PERÍODO FINAL', value: 'periodoFinal' },
                { text: 'QTD PRODUTOS', value: 'qtdProdutos' }
            ],
            periodos: [],
            paginacao: {
                pageNumber: 0,
                totalPages: 0,
                pageSize: 10,
                totalElements: 0,
                first: true,
                last: true
            },
        }
    },
    created() {
        this.loading = true;
        this.loadingTable = true;
    },
    mounted() {
        this.getPeriodos()
    },
    methods: {
        getPeriodos() {
            this.loading = true;
            this.$axios.$get(`franca/periodos?page=${this.paginacao.pageNumber}&size=${this.paginacao.pageSize}`)
                .then(res => {
                    this.periodos = res.content
                    this.paginacao = res.pageable;
                    this.paginacao.totalPages = res.totalPages;
                    this.paginacao.totalElements = res.totalElements;
                    this.paginacao.first = res.first;
                    this.paginacao.last = res.last;
                    this.loadingTable = false;
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                        this.loadingTable = false;
                })
            this.loading = false;
        },
        paged(val) {
            this.paginacao.pageSize = val.pageSize;
            this.getPeriodos()
        },
    }
}
</script>
  