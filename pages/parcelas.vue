<template>
    <v-col cols="12">
        <v-row justify="space-between" class="mx-2 my-4">
            <h2>{{ titlePage }}</h2>

            <v-dialog v-model="dialog" max-width="1200px" persistent>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" title="Novo Período" v-bind="attrs" v-on="on">
                        <span class="d-none d-sm-flex" >NOVA PARCELA</span>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <Cadastro :modeloCadastro="parcela" :tituloFormulario="tituloFormulario" @fechar-dialogo="dialog = false" @atualizar-dados="getParcelas"/>
            </v-dialog>
        </v-row>
        <v-data-table :headers="headers" :items="parcelas" class="elevation-1" show-expand :expanded.sync="expanded"
            item-key="codigo" single-expand hide-default-footer :page.sync="paginacao.pageNumber"
            :items-per-page.sync="paginacao.pageSize">
            <template v-slot:item.paga="{ item }">
                <v-icon :color="`${item.paga == -1 ? 'primary' : 'error'}`">mdi-{{ `${item.paga == -1 ? 'check' : 'close'}`
                }}</v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="ma-2 d-flex" no-gutters>
                        <v-col cols="12" sm="3">
                <th>ID VENDA:</th>
                <span>{{ item.idVenda }}</span>
    </v-col>
    <v-col cols="12" sm="3">
        <th>PERIODO INICIAL:</th>

        <span>{{ item.periodoInicial }}</span>
    </v-col>
    <v-col cols="12" sm="3">
        <th>PERIODO FINAL:</th>

        <span>{{ item.periodoFinal }}</span>
    </v-col>
    <v-col cols="12" sm="3">
        <th>DATA PAGAMENTO:</th>

        <span>{{ item.dataPagamento }}</span>
    </v-col>
    </v-row>
    <v-divider />

    </td>
    </template>
    <template v-slot:footer>
        <Paginacao :paginacao="paginacao" @paginacao="paged" />
    </template>
    </v-data-table>
    </v-col>
</template>
  
<script>
import Parcela from '@/models/Parcela'
import Erros from '@/models/Erros'
export default {
    data() {
        return {
            titlePage: 'PARCELAS',
            parcela : new Parcela(),
            tituloFormulario: 'CADASTRAR NOVA PARCELA',
            expanded: [],
            dialog: false,
            headers: [
                { text: 'CODIGO', value: 'codigo' },
                { text: 'CODIGO VENDA', value: 'venda.codigo' },

                { text: 'VENDEDOR', value: 'venda.vendedor.nomeVendedor' },
                { text: 'PRODUTO', value: 'venda.produto.nomeProduto' },
                { text: 'VALOR PARCELA', value: 'valorParcela' },
                { text: 'TOTAL', value: 'valorTotal' },
                { text: 'PAGA', value: 'paga' }
            ],
            parcelas: [],
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
        this.getParcelas()
    },
    methods: {
        getParcelas() {
            this.$axios.$get(`franca/parcelas?page=${this.paginacao.pageNumber}&size=${this.paginacao.pageSize}`)
                .then(res => {
                    this.parcelas = res.content
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
            this.getParcelas()
        },
    }
}
</script>
  