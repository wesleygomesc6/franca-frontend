<template>
    <v-col cols="12">
        <v-skeleton-loader v-if="loadingTable" type="article, article, article"></v-skeleton-loader>
        <template v-else>
        <v-row justify="space-between" class="mx-2 my-4">
            <h2>{{ titlePage }}</h2>
            <v-dialog v-model="dialog" max-width="1200px" persistent>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" title="Nova Venda" v-bind="attrs" v-on="on"><span class="d-none d-sm-flex">NOVA
                            VENDA
                        </span>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <CadastroVenda :modeloCadastro="venda" :tituloFormulario="tituloFormulario" @fechar-dialogo="dialog = false"
                    @atualizar-dados="getVendas"/>
            </v-dialog>
        </v-row>
        <v-data-table :headers="headers" :items="vendas" show-expand :expanded.sync="expanded" item-key="codigo"
            single-expand class="elevation-1" hide-default-footer :page.sync="paginacao.pageNumber"
            :items-per-page.sync="paginacao.pageSize">
            <template v-slot:item.cliente="{ item }">
                <v-icon color="primary">mdi-{{ `${item.cliente.cpf ? 'check-circle' : ''}` }}</v-icon>
            </template>
            <template v-slot:item.pj="{ item }">
                <v-icon color="primary">mdi-{{ `${item.cliente.cnpj ? 'check-circle' : ''}` }}</v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="ma-2 d-flex" no-gutters>
                        <v-col cols="12" sm="3">
                <th>PERÍODO:</th>

                <span>{{ item.periodo.periodoInicial }} - {{ item.periodo.periodoFinal }}</span>
    </v-col>
    <v-col cols="12" sm="3">
        <th>VIGÊNCIA:</th>

        <span>{{ item.vigencia }}</span>
    </v-col>
    <v-col cols="12" sm="3">
        <th>CLIENTE</th>

        <span>{{ item.cliente.nomeCompleto }}</span>
    </v-col> 
    <v-col cols="12" sm="3">
        <th>{{ `${item.cliente.cnpj ? 'CNPJ ' : 'CPF '}CLIENTE` }}:</th>

        <span>{{ item.cliente.cpf ? item.cliente.cpf : item.cliente.cnpj }}</span>
    </v-col>

    </v-row>
    <v-divider />
    <v-row class="ma-2 d-flex" no-gutters>
        <v-col cols="12" sm="3">
            <th>ADESAO ISENTA:</th>
            <v-icon color="primary">mdi-{{ `${item.adesaoIsenta != null && item.adesaoIsenta != 0 ? 'check-circle' :
                'circle-outline'}` }}</v-icon>
        </v-col>

        <v-col cols="12" sm="3">
            <th>VALOR ADESÃO:</th>

            <span class="text-center">{{ converterReais(item.valorAdesao) }}</span>
        </v-col>
        <v-col cols="12" sm="3">
            <th>VALOR MENSALIDADE:</th>

            <span>{{ converterReais(item.valorMensalidade) }}</span>
        </v-col>
        <v-col cols="12" sm="3">
            <th>LEAD:</th>
    
            <span>{{ item.leadName }}</span>
        </v-col>
    </v-row>
    <v-divider />
    <v-row class="ma-2 d-flex" no-gutters>

        <v-col cols="12" sm="3">
            <th>VALOR LEAD:</th>

            <span>{{ converterReais(item.valorLead) }}</span>
        </v-col>
        <v-col cols="12" sm="9">
            <th>OBSERVAÇÕES</th>

            <span>{{ item.observacoes }}</span>
        </v-col>
    </v-row>
    <v-divider />
    <v-row class="ma-2 d-flex" no-gutters>
        <v-col cols="12">
            <th>PARCELAS:</th>
            <v-row class="ma-1" no-gutters>
                <v-col cols="12" sm="2">
                    CÓDIGO
                </v-col>
                <v-col cols="12" sm="2">
                    VALOR TOTAL
                </v-col>
                <v-col cols="12" sm="2">
                    VALOR PARCELA
                </v-col>
                <v-col cols="12" sm="2">
                    DATA PAGAMANTO
                </v-col>
                <v-col cols="12" sm="2">
                    PAGA
                </v-col>
            </v-row>
            <template v-for="parcela in item.parcelas">
                <v-row class="ma-1" no-gutters>
                    <v-col cols="12" sm="2">
                        {{ parcela.codigo }}
                    </v-col>
                    <v-col cols="12" sm="2">
                        {{ parcela.valorTotal }}
                    </v-col>
                    <v-col cols="12" sm="2">
                        {{ parcela.valorParcela }}
                    </v-col>
                    <v-col cols="12" sm="2">
                        {{ parcela.dataPagamento }}
                    </v-col>
                    <v-col cols="12" sm="2">
                        {{ parcela.paga }}
                    </v-col>
                </v-row>
                <v-divider />
            </template>
        </v-col>

    </v-row>
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
import Erros from '@/models/Erros'
import Venda from '@/models/Venda.ts'
export default {
    data() {
        return {
            titlePage: 'VENDAS',
            dialog: false,
            loadingTable: false,
            venda: new Venda(),
            tituloFormulario: 'CADASTRAR NOVA VENDA',
            expanded: [],
            headers: [
                { text: 'COD', value: 'codigo' },
                { text: 'ID VENDA', value: 'idVenda' },
                { text: 'PRODUTO', value: 'produto.nomeProduto' },
                { text: 'GESTORRA', value: 'produto.gestora.nomeGestora' },
                { text: 'VENDEDOR', value: 'vendedor.nomeVendedor' },
                { text: 'QTD. VIDAS', value: 'quantidadeVidas' },
                { text: 'PF', value: 'cliente' },
                { text: 'PJ', value: 'pj' },
            ],
            vendas: [],
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
        this.loadingTable = true;
    },
    created() {
        this.getVendas()
    },
    methods: {
        getVendas() {
            this.$axios.$get(`franca/vendas?page=${this.paginacao.pageNumber}&size=${this.paginacao.pageSize}`)
                .then(res => {
                    this.vendas = res.content
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
        },
        paged(val) {
            this.paginacao.pageSize = val.pageSize;
            this.getVendas()
        },
        converterReais(valor) {
            if (valor !== null && valor !== 0) {

                return valor.toLocaleString('pt-br',
                    { style: 'currency', currency: 'BRL' })
            } else {
                return '-'
            }
        }
    }
}
</script>
  