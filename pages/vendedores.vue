<template>
    <v-col cols="12" md="8" xl="6">
        <v-row justify="space-between" class="mx-2 my-4">
            <h2>{{ titlePage }}</h2>
            <v-dialog v-model="dialog" max-width="1200px" persistent>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" title="Novo Vendedor" v-bind="attrs"
                            v-on="on"><span class="d-none d-sm-flex" >NOVO VENDEDOR
                        </span>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <Cadastro :modeloCadastro="vendedor" :tituloFormulario="tituloFormulario" 
                @fechar-dialogo="dialog = false" @atualizar-dados="getVendedores"
                
                />
            </v-dialog>
        </v-row>
        <v-data-table :headers="headers" :items="vendedores" class="elevation-1" hide-default-footer
            :page.sync="paginacao.pageNumber" :items-per-page.sync="paginacao.pageSize">
            <template v-slot:footer>
                <Paginacao :paginacao="paginacao" @paginacao="paged" />
            </template>
        </v-data-table>
    </v-col>
</template>
  
<script>
import Vendedor from '@/models/Vendedor'
import Erros from '@/models/Erros'
export default {
    data() {
        return {
            titlePage: 'VENDEDORES',
            vendedor: new Vendedor(),
            tituloFormulario: 'CADASTRAR NOVO VENDEDOR',
            dialog: false,
            loading: false,
            headers: [
                { text: 'COD', value: 'codigo' },
                // { text: 'CPF', value: 'cpf' },
                { text: 'NOME', value: 'nomeVendedor' },
                { text: 'CATEGORIA', value: 'categoria' },
            ],
            vendedores: [],
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
        this.getVendedores()
    },
    methods: {
        getVendedores() {
            this.$axios.$get(`franca/vendedores?page=${this.paginacao.pageNumber}&size=${this.paginacao.pageSize}`)
                .then(res => {
                    this.vendedores = res.content
                    this.paginacao = res.pageable;
                    this.paginacao.totalPages = res.totalPages;
                    this.paginacao.totalElements = res.totalElements;
                    this.paginacao.first = res.first;
                    this.paginacao.last = res.last;
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                })
        },
        paged(val) {
            this.paginacao.pageSize = val.pageSize;
            this.getVendedores()
        },
    }
}
</script>
  