<template>
    <v-col cols="12">
        <v-skeleton-loader v-if="loadingTable" type="article, article, article"></v-skeleton-loader>
        <template v-else>
        <v-row justify="space-between" class="mx-2 my-4">
            <h2>{{ titlePage }}</h2>
            <v-dialog v-model="dialog" max-width="1200px" persistent>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" title="Novo Produto" v-bind="attrs" v-on="on">
                        <span class="d-none d-sm-flex">NOVO
                            PRODUTO
                        </span>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <Cadastro :modeloCadastro="produto" :tituloFormulario="tituloFormulario" @fechar-dialogo="dialog = false" @atualizar-dados="getProdutos"/>
            </v-dialog>
        </v-row>
        <v-data-table :headers="headers" :items="produtos" item-key="codigo" class="elevation-1" hide-default-footer
            :page.sync="paginacao.pageNumber" :items-per-page.sync="paginacao.pageSize">
            <template v-slot:item.vitalicioAdesao="{ item }">
                <v-icon color="primary">mdi-{{ `${item.vitalicioAdesao ? 'check-circle' : ''}` }}</v-icon>
            </template>
            <template v-slot:item.vitalicioMensalidade="{ item }">
                <v-icon color="primary">mdi-{{ `${item.vitalicioMensalidade ? 'check-circle' : ''}` }}</v-icon>

            </template>
            <template v-slot:item.vitalicioPorcentagem="{ item }">
                <v-icon color="primary">mdi-{{ `${item.vitalicioPorcentagem ? 'check-circle' : ''}` }}</v-icon>

            </template>
            <template v-slot:footer>
                <Paginacao :paginacao="paginacao" @paginacao="paged" />
            </template>

        </v-data-table>
    </template>
    </v-col>
</template>
  
<script>
import Produto from '@/models/Produto.ts'
import Erros from '@/models/Erros'
export default {
    data() {
        return {
            titlePage: 'PRODUTOS',
            produto: new Produto(),
            tituloFormulario: 'CADASTRAR NOVO PRODUTO',
            dialog: false,
            loading: false,
            loadingTable: false,
            headers: [
                { text: 'COD', value: 'codigo' },
                { text: 'NOME', value: 'nomeProduto' },
                { text: 'GESTORA', value: 'gestora.nomeGestora' },
                { text: 'DESC. PRODUTO', value: 'descricaoProduto' },
                { text: 'V. ADESÃO', value: 'vitalicioAdesao' },
                { text: 'V. MENSALIDADE', value: 'vitalicioMensalidade' },
                { text: 'V. PORCENTAGEM', value: 'vitalicioPorcentagem' },
            ],
            produtos: [],
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
    mounted() {
        this.loading = true;
        this.loadingTable = true;
    },
    created() {
        this.getProdutos()
    },
    methods: {
        getProdutos() {
            this.loading = true;
            this.$axios.$get(`franca/produtos?page=${this.paginacao.pageNumber}&size=${this.paginacao.pageSize}`)
                .then(res => {
                    this.produtos = res.content
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
            this.getProdutos()
        },
    }
}
</script>
  