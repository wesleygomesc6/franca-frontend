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
            <v-form ref="form">
                <v-row class="pa-2 ma-0" no-gutters>
                    <template v-for="(value, index) in modeloCadastro"><v-col cols="12" sm="6" md="4"
                            v-if="index !== 'cod' && index !== 'codigo'" class="px-1">
                            <template v-if="index === 'valorAdesao' || index === 'valorMensalidade'
                                || index === 'vitalicioMensalidade' || index === 'vitalicioAdesao'
                                || index === 'vitalicioPorcentagem'">
                                <v-checkbox :key="modeloCadastro.key" v-model="modeloCadastro[index]"
                                    :label="separar(index)" class="my-auto"></v-checkbox>
                            </template>
                            <template v-else-if="index === 'categoria'">
                                <v-select v-model="modeloCadastro[index]" :items="categorias" label="CATEGORIA" solo dense
                                    outlined></v-select>

                            </template>
                            <template v-else-if="index === 'gestora'">
                                <v-autocomplete v-model="modeloCadastro[index]" dense outlined return-object
                                    :items="gestoras" item-text="nomeGestora" @focus="getGestoras()">
                                </v-autocomplete>
                            </template>
                            <template v-else-if="index === 'produtos'">
                                <v-autocomplete v-model="modeloCadastro[index]" dense outlined return-object
                                    :items="produtos" item-text="nomeProduto" small-chips deletable-chips hide-selected
                                    multiple item-value="codigo" @focus="getProdutos()">
                                </v-autocomplete>
                            </template>
                            <v-text-field v-else :key="modeloCadastro.key" v-model="modeloCadastro[index]" outlined dense
                                :label="separar(index)" clearable>
                            </v-text-field>
                        </v-col>
                    </template>

                </v-row>
                <v-row class="pa-2 ma-0" justify="end">
                    <v-btn color="warning" title="Limpar" @click="limpar()">LIMPAR</v-btn>
                    <v-btn color="primary" title="Salvar" @click="salvar(modeloCadastro)" :loading="loading"
                        class="ml-2">SALVAR</v-btn>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>
import Erros from '../models/Erros'
export default {
    name: 'Cadastro',
    props: ['modeloCadastro', 'tituloFormulario'],
    data() {
        return {
            loading: false,
            menu: false,
            categorias: ['EXTERNO', 'INTERNO'],
            gestoras: [],
            produtos: []
        }
    },
    methods: {
        separar(label) {
            return label.split(/(?=[A-Z])/).join(" ").toUpperCase()
        },
        getGestoras() {
            this.$axios.$get('franca/gestoras').then(res => this.gestoras = res.content).catch(err => this.$snotify.warning(err, 'Erro'))
        },
        getProdutos() {
            this.$axios.$get('franca/produtos').then(res => this.produtos = res.content).catch(err => this.$snotify.warning(err, 'Erro'))
        },
        salvar(modelo) {
            this.loading = true
            this.$axios.$post(`franca${this.$route.path}`, modelo)
                .then(() => {
                    this.$snotify.success('Cadastrado com sucesso', 'Ok')
                    this.dialog = false
                    this.$emit('fechar-dialogo');
                    this.$emit('atualizar-dados');
                    this.limpar();
                })
                .catch(err => {
                    const erro = Erros.mapearErro(err.request.status)
                    erro.type === 'warning' ? this.$snotify.warning(erro.text, erro.title)
                        : this.$snotify.error(erro.text, erro.title)
                    })
                    this.loading = false

        },
        limpar() {
            this.$refs.form.reset()
        }
    }
}
</script>