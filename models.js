import Sequelize from 'sequelize';

// Conexão com o banco de dados
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.db'
});

// Autenticação com tratamento de erro
sequelize.authenticate()
    .then(() => console.log('Conexão bem-sucedida com o banco de dados'))
    .catch(erro => console.error('Erro ao conectar ao banco de dados:', erro));

// Definição do modelo Produto
export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.DataTypes.INTEGER,  // Corrigido para Sequelize.DataTypes
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.DataTypes.STRING,  // Corrigido para Sequelize.DataTypes
        allowNull: false,
        unique: true
    },
    preco: {
        type: Sequelize.DataTypes.DOUBLE,  // Corrigido para Sequelize.DataTypes
        allowNull: false
    }
});

// Função para criar um produto
// Exemplo de como adicionar um produto com validação
export async function criaProduto(produtoData) {
    try {
        // Validação dos dados do produto (exemplo: nome e valor)
        if (!produtoData.nome || !produtoData.preco) {
            throw new Error('Nome e valor do produto são obrigatórios.');
        }

        
        // Tente adicionar o produto ao banco de dados
        const produtoCriado = await Produto.create(produtoData);
        console.log('Produto adicionado:', produtoCriado.nome);
        return produtoCriado
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Erro de unicidade: o produto já existe.');
        } else {
            console.error('Erro ao adicionar produto:', error.message);
        }
        
        throw error
    } 
}

// Função para ler todos os produtos
export async function lerProdutos() {
    try {
        const resultado = await Produto.findAll();
        console.log('Produtos consultados com sucesso!', resultado);
        return resultado

    } catch (erro) {
        console.log('Erro ao buscar produto', erro);
        throw erro
    }
}

// Função para ler produto por ID
export async function lerProdutosPorId(id) {
    try {
        const resultado = await Produto.findByPk(id);
        console.log('Produto consultado com sucesso!', resultado);
        return resultado
    } catch (erro) {
        console.log('Erro ao buscar produto', erro);
        throw erro
    }
}

// Função para atualizar produto por ID
export async function atualizaProdutosPorId(id, dadosProduto) {
    try {
        const resultado = await Produto.findByPk(id);
        if(resultado?.id){
            for(const chave in dadosProduto){
                if(chave in resultado){
                    resultado[chave]=dadosProduto[chave]
                }
            }
            resultado.save()
            console.log('Produto atualizado com sucesso!', resultado);
        }
        return resultado
    } catch (erro) {
        console.log('Erro ao atualizar produto', erro);
        throw erro
    }
}

// Função para deletar produto por ID
export async function deletaProdutoPorId(id) {
    try {
        const resultado = await Produto.destroy({ where: { id: id } });
        
        // Retorna true se o produto foi deletado, caso contrário retorna false
        if (resultado > 0) {
            console.log('Produto deletado com sucesso!', resultado);
            return true;
        } else {
            console.log('Produto não encontrado ou não foi deletado');
            return false;
        }
    } catch (erro) {
        console.log('Erro ao deletar produto', erro);
        throw erro;  // Lança o erro para que a função que chamou deletaProdutoPorId possa tratá-lo
    }
}


export const Pedido = sequelize.define('pedido', {
    id:{
        type: Sequelize.DataTypes.INTEGER,  // Corrigido para Sequelize.DataTypes
        primaryKey: true,
        autoIncrement: true
    },
    valor_total:{
        type: Sequelize.DOUBLE,
        allowNull:false
    },
    estado: {
        type:Sequelize.STRING,
        allowNull: false
    }
})


export const ProdutosPedido = sequelize.define('produtos_pedido',{
    id: {
        type: Sequelize.DataTypes.INTEGER,  // Corrigido para Sequelize.DataTypes
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull:false
    },
    preco: {
        type:Sequelize.DataTypes.DOUBLE,
        allowNull:false
    }
})


Produto.belongsToMany(Pedido, {through: ProdutosPedido})
Pedido.belongsToMany(Produto, {through: ProdutosPedido})


export async function criaPedido(novoPedido) {
    try {
        const pedido = await Pedido.create({
            valor_total: novoPedido.valorTotal,
            estado: "ENCAMINHADO"
        });

        for (const prod of novoPedido.produtos) {
            // Aguarda a resolução da promessa para obter o produto
            const produto = await Produto.findByPk(prod.id);
            
            if (produto) { // Certifique-se de que o produto foi encontrado
                await pedido.addProduto(produto, {
                    through: { quantidade: prod.quantidade, preco: produto.preco }
                });
            } else {
                console.log(`Produto com ID ${prod.id} não encontrado.`);
            }
        }

        console.log("Pedido criado com sucesso!");
        return pedido;
    } catch (error) {
        console.log("Falha ao criar pedido", error);
        throw error;
    }
}


export async function lerPedidos(){
    try {
        const resultado = await ProdutosPedido.findAll()
        console.log("Pedidos foram consultado com sucesso!", resultado)
        return resultado
    } catch (error) {
        console.log("Falha ao consultar pedidos", erro)
        throw error
    }
}

export async function lerPedidosPorId(id){
    try {
        const resultado = Pedido.findByPk(id)
        console.log("Pedido foi consultado com sucesso!", resultado)
        return resultado
    } catch (error) {
        console.log("Falha ao consultar pedido", erro)
        throw error
    }
}

