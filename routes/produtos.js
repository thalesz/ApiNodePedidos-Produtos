import express from 'express';
import { criaProduto, atualizaProdutosPorId, deletaProdutoPorId, lerProdutosPorId, lerProdutos } from '../models.js';

export const rotasProduto = express.Router();

rotasProduto.post('/produtos', async (req, res, next) => {
    const produto = req.body;
    if (!produto?.nome || !produto?.preco) {
        res.statusCode = 400;
        return res.send({
            erro: {
                mensagem: "Os atributos 'nome' e 'preco' são obrigatórios para a criação do produto"
            }
        });
    }

    try {
        const resposta = await criaProduto(produto);
        res.statusCode = 201;
        res.send(resposta);
    } catch (erro) {
        console.log("Erro:", erro);
        res.statusCode = 500;
        res.send({
            erro: {
                mensagem: 'Erro ao criar o produto'
            }
        });
    }
});

rotasProduto.patch('/produtos/:id', async (req, res, next) => {
    const produto = req.body;
    if (!produto?.nome && !produto?.preco) {
        res.statusCode = 400;
        return res.send({
            erro: {
                mensagem: 'Ao menos um atributo (nome ou preco) é necessário para a atualização'
            }
        });
    }

    const id = req.params.id;

    try {
        const resposta = await atualizaProdutosPorId(id, produto);
        if (!resposta) {
            res.statusCode = 404;
            return res.send({
                erro: {
                    mensagem: 'Produto não encontrado'
                }
            });
        }

        res.statusCode = 200;
        res.send(resposta);
    } catch (erro) {
        console.log("Erro:", erro);
        res.statusCode = 500;
        res.send({
            erro: {
                mensagem: 'Erro ao atualizar o produto'
            }
        });
    }
});

rotasProduto.delete('/produtos/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const encontrado = await deletaProdutoPorId(id);
        if (!encontrado) {
            res.statusCode = 404;
            return res.send({
                erro: {
                    mensagem: 'Produto não encontrado para exclusão'
                }
            });
        }

        res.statusCode = 204;
        res.send();
    } catch (erro) {
        console.log("Erro:", erro);
        res.statusCode = 500;
        res.send({
            erro: {
                mensagem: `Erro ao remover o produto ${id}`
            }
        });
    }
});

rotasProduto.get('/produtos/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const resposta = await lerProdutosPorId(id);
        if (!resposta) {
            res.statusCode = 404;
            return res.send({
                erro: {
                    mensagem: 'Produto não encontrado'
                }
            });
        }

        res.statusCode = 200;
        res.send(resposta);
    } catch (erro) {
        console.log("Erro:", erro);
        res.statusCode = 500;
        res.send({
            erro: {
                mensagem: `Erro ao buscar o produto ${id}`
            }
        });
    }
});

rotasProduto.get('/produtos', async (req, res, next) => {
    try {
        const resposta = await lerProdutos();
        res.statusCode = 200;
        res.send(resposta);
    } catch (erro) {
        console.log("Erro:", erro);
        res.statusCode = 500;
        res.send({
            erro: {
                mensagem: 'Erro ao buscar os produtos'
            }
        });
    }
});
