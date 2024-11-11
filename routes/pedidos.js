import express from "express";
import { criaPedido, lerPedidos, lerPedidosPorId } from "../models.js";

export const rotasPedido = express.Router();

rotasPedido.post("/pedidos", async (req, res, next) => {
    const pedido = req.body;

    res.statusCode = 400;

    if (!pedido?.produtos || !pedido.produtos.length) {
        const resposta = {
            erro: {
                mensagem: "O atributo 'produtos' não foi encontrado ou está vazio"
            }
        };
        res.send(resposta); // Envia a resposta e interrompe a execução
        return; // Evita continuar a execução da função
    }

    if (!pedido?.valorTotal || pedido.valorTotal <= 0) {
        const resposta = {
            erro: {
                mensagem: "O atributo 'valorTotal' não foi encontrado ou é menor ou igual a zero"
            }
        };
        res.send(resposta); // Envia a resposta e interrompe a execução
        return; // Evita continuar a execução da função
    }

    try {
        const resposta = await criaPedido(pedido);
        res.status(201).send(resposta);
    } catch (erro) {
        console.log('Falha ao criar o pedido', erro);
        const resposta = {
            erro: {
                mensagem: 'Erro ao criar o pedido'
            }
        };
        res.status(500).send(resposta);
    }
});

rotasPedido.get("/pedidos/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const resposta = await lerPedidosPorId(id);
        if (!resposta) {
            res.status(404).send({
                erro: {
                    mensagem: `Pedido não encontrado`
                }
            });
            return; // Evita continuar
        }
        res.status(200).send(resposta);
    } catch (erro) {
        res.status(500).send({
            erro: {
                mensagem: `Erro ao buscar o pedido ${id}`
            }
        });
    }
});

rotasPedido.get("/pedidos", async (req, res, next) => {
    try {
        const resposta = await lerPedidos();
        res.status(200).send(resposta);
    } catch (erro) {
        res.status(500).send({
            erro: {
                mensagem: `Erro ao buscar os pedidos`
            }
        });
    }
});
