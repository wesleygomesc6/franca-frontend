export default class Erros {
    constructor(codigoErro) {
        this.codigoErro = codigoErro
    }
    static mapearErro(codigoErro) {
        let retorno = null
        const erros = [
            { erro: 400, type: 'warning', title: 'Revise os dados', text: 'Nenhum registro encontrado com esses parametros.' },
            { erro: 401, type: 'warning', title: 'Login necessário', text: 'Você precisa fazer login pra acessar o recurso.' },
            { erro: 403, type: 'warning', title: 'Sem acesso ao recurso', text: 'Você não tem acesso a esse recurso.' },
            { erro: 404, type: 'warning', title: 'Dados não encontrados', text: 'O endereço da requisição esta incorreto.' },
            { erro: 500, type: 'error', title: 'Erro no Servidor', text: 'O servidor está fora do ar.' },
            { erro: 0, type: 'error', title: 'Erro', text: 'Sem conexão com o servidor.' },
            { erro: 'Netwok Error', type: 'error', title: 'Erro', text: 'Sem conexão com o servidor.' }
        ];

        erros.forEach(erro => {
            if (erro.erro === codigoErro) {
                retorno = erro
            }
        })

        return retorno
    }
}