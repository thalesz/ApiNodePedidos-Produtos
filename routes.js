import fs from 'fs';
import { criaProduto, atualizaProdutosPorId, deletaProdutoPorId, lerProdutosPorId, lerProdutos } from './models.js';

export default async function rotas(req, res, dado) {
    res.setHeader('Content-type', 'application/json', 'utf-8');

    if (req.method === 'GET' && req.url === '/') {
        const { conteudo } = dado;
        res.statusCode = 200;
        const resposta = {
            mensagem: conteudo
        };
        res.end(JSON.stringify(resposta));
        return;
    }

    if (req.method === 'POST' && req.url === '/produtos') {
        const corpo = [];
        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async () => {
            const produto = JSON.parse(corpo);
            if (!produto?.nome) {
                res.statusCode = 400;
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }
            if (!produto?.preco) {
                res.statusCode = 400;
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'preco' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }
            try{
                const resposta = await criaProduto(produto)
                res.statusCode = 201;
                res.end(JSON.stringify(resposta));
                return
            }catch(erro){
                console.log("erro:", erro)
                const resposta = {
                    erro: {
                        mensagem: 'Erro ao criar o produto'
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }

            // fs.writeFile(`${produto.nome}.txt`, produto?.conteudo ?? '', 'utf-8', (erro) => {
            //     if (erro) {
            //         res.statusCode = 500;
            //         const resposta = {
            //             erro: {
            //                 mensagem: 'Erro ao criar o produto'
            //             }
            //         };
            //         res.end(JSON.stringify(resposta));
            //         return;
            //     }

            //     res.statusCode = 201;
            //     const resposta = {
            //         mensagem: 'Produto criado com sucesso',
            //         produto: produto.nome
            //     };
            //     res.end(JSON.stringify(resposta));
            // });
        });

        req.on('error', (erro) => {
            console.log("Falha ao processar a requisição", erro);
            res.statusCode = 400;
            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            };

            res.end(JSON.stringify(resposta));
        });
        return;
    }

    // /produtos/2992
    if (req.method === 'PATCH' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const corpo = [];
        req.on('data', (parte) => {
            corpo.push(parte);
        });
    
        req.on('end', async () => {
            const produto = JSON.parse(corpo);
            if (!produto?.nome && !produto.preco) {
                res.statusCode = 400;
                const resposta = {
                    erro: {
                        mensagem: `Nenhum atributo foi encontrado. porém ao menos um é obrigatorio para atualização do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }
            const id = req.url.split('/')[2];
    
            try {
                const resposta = await atualizaProdutosPorId(id, produto);
                res.statusCode = 200;


                if(!resposta){
                    res.statusCode=404;
                }
                res.end(JSON.stringify(resposta));
            } catch (erro) {
                if (erro) {
                    res.statusCode = 500;
                    const resposta = {
                        erro: {
                            mensagem: 'Erro ao atualizar o produto'
                        }
                    };
                    res.end(JSON.stringify(resposta));
                    return;
                }
            }
        });
    
        req.on('error', (erro) => {
            console.log("Falha ao processar a requisição", erro);
            res.statusCode = 400;
            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            };
    
            res.end(JSON.stringify(resposta));
        });
        return;
    }
    

    if (req.method === 'GET' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];
        try {
            const resposta = await lerProdutosPorId(id);
            if(!resposta){
                res.statusCode=404;
            }
            res.statusCode = 200;
            res.end(JSON.stringify(resposta));
            return;
        } catch (erro) {
            res.statusCode = 500;
            const resposta = {
                erro: {
                    mensagem: `Erro ao buscar o produto ${id}`
                }
            };
            res.end(JSON.stringify(resposta));
            return;
        }
    }
    
    if (req.method === 'GET' && req.url === '/produtos' ) {

        try{
            const resposta = await lerProdutos()
            res.statusCode = 200;
            res.end(JSON.stringify(resposta));
            return
        }catch(erro){
            if (erro) {
                res.statusCode = 500;
                const resposta = {
                    erro: {
                        mensagem: `Erro ao buscar o produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }
        }
        
        

    }

    if (req.method === 'DELETE' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];
    
        try {
            const encontrado = await deletaProdutoPorId(id);
            res.statusCode = 204;
            if(!encontrado){
                res.statusCode = 404;
            }
            res.end();
            return;
        } catch (erro) {
            res.statusCode = 500;
            const resposta = {
                erro: {
                    mensagem: `Erro ao remover o produto ${id}`
                }
            };
            res.end(JSON.stringify(resposta));
            return;
        }
    }
    

    // Rota não encontrada
    res.statusCode = 404;
    const resposta = {
        erro: {
            mensagem: 'Rota não encontrada',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));
}
