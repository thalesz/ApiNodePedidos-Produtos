import { sequelize} from './models.js';
import bodyParser from 'body-parser';
import express from 'express';

import { rotasProduto } from './routes/produtos.js';
import { rotasPedido } from './routes/pedidos.js';

const app = express()
app.use(bodyParser.json())



app.use(rotasProduto)
app.use(rotasPedido)



// Inicializa o banco de dados através do Sequelize
async function inicializaBancoDeDados() {
    try {
        await sequelize.authenticate();
        console.log('Conexão bem-sucedida com o banco de dados via Sequelize');
        await sequelize.sync(); // Sincroniza os modelos
    } catch (erro) {
        console.log('Erro ao conectar ou sincronizar o banco de dados:', erro);
        throw erro; // Propaga o erro caso precise ser tratado posteriormente
    }
}

// Função que inicia o servidor HTTP
async function inicializaApp() {
    try {
        await inicializaBancoDeDados(); // Aguarda a inicialização e sincronização do banco
        const porta = 3000;
        app.listen(porta)

    } catch (erro) {
        console.error('Erro ao iniciar o servidor ou banco de dados:', erro);
    }
}

inicializaApp();


