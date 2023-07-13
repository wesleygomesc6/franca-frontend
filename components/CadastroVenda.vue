<template>
    <v-card>
        <v-row justify="space-between" align="center" class="pa-2 ma-0">
            <v-card-title class="text-subtitle-1 text-sm-h5">
                {{ tituloFormulario.toUpperCase() }}
            </v-card-title>
            <v-btn text color="error" @click="$emit('fechar-dialogo')"
                title="Fechar caixa de dialogo"><v-icon>mdi-close</v-icon></v-btn>
        </v-row>
        <v-card-text class="text--primary">
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row class="pa-2 ma-0" no-gutters>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-autocomplete :items="periodos" label="PERÍODO" v-model="venda.periodo" item-text="intervalo"
                            dense outlined @focus="getPeriodos" clearable required return-object>
                            <template v-slot:item="{ item }">
                                <template>
                                    <v-list-item-content :class="{ 'accent': item.mesAtual == true }">
                                        <v-list-item-title v-html="item.intervalo"></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1" v-if="venda.periodo">
                        <v-autocomplete v-model="venda.produto"
                            :items="periodos.filter(periodo => periodo.codigo === venda.periodo.codigo)[0].produtos"
                            item-text="nomeProduto" label="NOME PRODUTO" hide-selected outlined dense
                            item-value="nomeProduto" small-chips deletable-chips no-data-text="Nenhum produto encontrado."
                            :disabled="!venda.periodo" required return-object>
                        </v-autocomplete>
                    </v-col>
                    <!-- Dados do cliente -->
                    <v-col cols="12" sm="6" md="4" class="px-1 d-flex justify-space-around">
                        <v-checkbox v-model="clientePf" label="PF" class="my-auto">
                        </v-checkbox>
                        <v-checkbox v-model="clientePj" label="PJ" class="my-auto">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field v-model="cliente.nomeCompleto" outlined dense label="NOME CLIENTE" clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field v-model="cliente.dataNascimento" outlined dense label="DATA NASC. CLIENTE" clearable
                            required>
                        </v-text-field>
                    </v-col>
                    <template v-if="clientePf">
                        <v-col cols="12" sm="6" md="4" class="px-1">
                            <v-text-field v-model="cliente.cpf" outlined dense label="CPF CLIENTE" clearable required>
                            </v-text-field>
                        </v-col>
                    </template>
                    <template v-if="clientePj">
                        <v-col cols="12" sm="6" md="4" class="px-1">
                            <v-text-field v-model="cliente.cnpj" outlined dense label="CNPJ CLIENTE" clearable required>
                            </v-text-field>
                        </v-col>
                    </template>
                    <v-col cols="12" sm="6" md="4" class="px-1 d-flex justify-end"><v-checkbox v-model="clienteResponsavel"
                            label="RESPONSAVEL" class="my-auto">
                        </v-checkbox></v-col>

                    <template v-if="clienteResponsavel">
                        <v-col cols="12" sm="6" md="4" class="px-1"><v-text-field v-model="cliente.nomeResponsavel" outlined
                                dense label="NOME RESPONSAVEL" clearable required>
                            </v-text-field></v-col>
                        <v-col cols="12" sm="6" md="4" class="px-1"><v-text-field v-model="cliente.cpfResponsavel" outlined
                                dense label="CPF RESPONSAVEL" clearable required>
                            </v-text-field></v-col>

                    </template>

                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-autocomplete :search-input.sync="buscarVendedores" @focus="getVendedores(null)"
                            v-model="venda.vendedor" :items="vendedores" item-text="nomeVendedor" label="NOME VENDEDOR"
                            hide-selected outlined dense small-chips deletable-chips
                            no-data-text="Nenhum vendedor encontrado." required return-object>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field v-model="venda.idVenda" label="ID VENDA" outlined dense clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1 d-flex justify-end">
                        <v-checkbox v-model="venda.adesaoIsenta" label="ADESÃO ISENTA" outlined dense clearable>
                        </v-checkbox>
                    </v-col>
                    <template v-if="venda.adesaoIsenta != true">
                        <v-col cols="12" sm="6" md="4" class="px-1">
                            <v-text-field type="number" v-model="venda.valorAdesao" label="VALOR ADESÃO" outlined dense
                                clearable :disabled="venda.adesaoIsenta == true" required>
                            </v-text-field>
                        </v-col>
                    </template>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field type="date" v-model="venda.vigencia" label="VIGÊNCIA" outlined dense clearable>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field type="number" v-model="venda.quantidadeVidas" label="QTD VIDAS" outlined dense
                            clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field type="number" v-model="venda.valorMensalidade" label="VALOR MENSALIDADE" outlined
                            dense clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field type="number" v-model="venda.quantidadeParcelas" label="PARCELAS" outlined dense
                            clearable required>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field v-model="venda.leadName" label="LEAD" outlined dense clearable>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-1">
                        <v-text-field type="number" v-model="venda.valorLead" label="VALOR LEAD" outlined dense clearable>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="8" class="px-1">
                        <v-textarea v-model="venda.observacoes" label="OBSERVAÇÕES" outlined dense clearable auto-grow
                            rows="1" row-height="15">
                        </v-textarea>
                    </v-col>

                </v-row>
                <v-row class="pa-2 ma-0" justify="end">
                    <v-btn color="warning" title="Limpar" @click="limpar()">LIMPAR</v-btn>
                    <v-btn color="primary" title="Salvar" @click="salvar(venda)" :loading="loading" :disabled="!valid"
                        class="ml-2">SALVAR</v-btn>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>
import Erros from '../models/Erros'
import Venda from '@/models/Venda.ts'
import Cliente from '@/models/Cliente.ts'
export default {
    name: 'CadastroVenda',
    props: ['tituloFormulario'],
    data: (vm) => ({
        valid: true,
        venda: new Venda(),
        cliente: new Cliente(),
        loading: false,
        clientePf: false,
        clientePj: false,
        clienteResponsavel: false,
        periodos: [],
        buscarVendedores: '',
        produtos: [],
        vendedores: [],

    }),
    watch: {
        buscarVendedores(val) {
            this.getVendedores(val);
        },
    },
    methods: {
        separar(label) {
            return label.split(/(?=[A-Z])/).join(" ").toUpperCase()
        },
        salvar(venda) {
            this.loading = true
            venda.usuarioCadastro = {
                codigo: 1
            };
            venda.cliente = this.cliente;
            venda.cliente.usuarioRegistro = {
                codigo: 1
            }

            this.$axios.$post('franca' + this.$route.path, venda)
                .then(() => {
                    this.$snotify.success('Cadastrado com sucesso')
                    this.dialog = false
                    this.loading = false
                    this.$emit('fechar-dialogo')
                    this.$emit('atualizar-dados')
                    this.limpar()
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                    this.loading = false
                })

        },
        verificarMesAtual(intervalo) {
            let mesAtual = (new Date().getMonth() + 1);
            const mesIntervalo = intervalo.split('/')[3];

            if (mesAtual < 10) mesAtual = '0' + mesAtual;

            if (mesAtual === mesIntervalo) return true;

            return false;

        },
        getPeriodos() {
            this.loading = true;
            this.$axios.$get(`franca/periodos`)
                .then(res => {
                    this.periodos = res.content.map(({ codigo, periodoInicial, periodoFinal, produtos }) =>
                        ({ codigo: codigo, intervalo: `${periodoInicial} a ${periodoFinal}`, mesAtual: this.verificarMesAtual(`${periodoInicial} a ${periodoFinal}`), produtos: produtos }))
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                })
            this.loading = false;

        },
        getVendedores(vendedor) {
            let url = '';
            vendedor == null ? url = 'franca/vendedores' : url = `franca/vendedores?nomeVendedor=${vendedor}`;
            this.$axios.$get(url)
                .then(res => {
                    this.vendedores = res.content
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                    this.loading = false
                })

        },
        limpar() {
            this.$refs.form.reset()
        },
        formatDate(date) {
            if (!date) return null;
            const [year, month, day] = date.split("T")[0].split("-");
            return `${day}/${month}/${year}`;
        },
    }
}
</script>