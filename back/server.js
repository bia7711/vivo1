const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Simula um banco de dados em memória
const usuarios = [];
const pecas = [
    // Roupas Femininas
    { id: 1, titulo: "Vestido Floral", descricao: "Vestido leve e estampado para o verão.", categoria: "Feminino", preco: 45.00, isPremium: false, idUsuario: null, imagem: "/uploads/vestido_floral.jpg" },
    { id: 2, titulo: "Calça Jeans Skinny", descricao: "Calça jeans azul, corte skinny, tamanho 38.", categoria: "Feminino", preco: 60.00, isPremium: true, idUsuario: null, imagem: "/uploads/calca_jeans_feminina.jpg" },
    { id: 3, titulo: "Blusa de Alcinha Branca", descricao: "Blusa básica de alcinha, ideal para combinar com qualquer look.", categoria: "Feminino", preco: 20.00, isPremium: false, idUsuario: null, imagem: "/uploads/blusa_branca_alca.jpg" },

    // Roupas Masculinas
    { id: 4, titulo: "Camisa Polo Azul", descricao: "Camisa polo de piquet, cor azul marinho, tamanho M.", categoria: "Masculino", preco: 35.00, isPremium: false, idUsuario: null, imagem: "/uploads/camisa_polo.jpg" },
    { id: 5, titulo: "Calça Cargo Preta", descricao: "Calça cargo preta com bolsos laterais.", categoria: "Masculino", preco: 70.00, isPremium: true, idUsuario: null, imagem: "/uploads/calca_cargo_masculina.jpg" },
    { id: 6, titulo: "Jaqueta Jeans Clássica", descricao: "Jaqueta jeans com lavagem clássica, tamanho G.", categoria: "Masculino", preco: 90.00, isPremium: false, idUsuario: null, imagem: "/uploads/jaqueta_jeans_masculina.jpg" },

    // Roupas Infantis
    { id: 7, titulo: "Macacão de Bebê", descricao: "Macacão de algodão macio para bebês de 6 a 12 meses.", categoria: "Infantil", preco: 25.00, isPremium: true, idUsuario: null, imagem: "/uploads/macacao_bebe.jpg" },
    { id: 8, titulo: "Conjunto Camiseta e Bermuda", descricao: "Conjunto para crianças de 2 anos.", categoria: "Infantil", preco: 40.00, isPremium: false, idUsuario: null, imagem: "/uploads/conjunto_infantil.jpg" },
    { id: 9, titulo: "Vestido de Festa Infantil", descricao: "Vestido para meninas, ideal para festas, tamanho 5 anos.", categoria: "Infantil", preco: 85.00, isPremium: true, idUsuario: null, imagem: "/uploads/vestido_infantil.jpg" }
];


// Configuração do express-session
app.use(session({
    secret: 'sua-chave-secreta', // Uma string aleatória e segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Para ambientes de desenvolvimento (http)
}));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, '../front')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do body-parser para lidar com dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para verificar se o usuário está logado
function requireLogin(req, res, next) {
    if (req.session.userId) {
        next(); // Usuário está logado, continua para a próxima função da rota
    } else {
        res.status(401).send('Você precisa estar logado para acessar esta função.');
    }
}

// Rotas para as páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

app.get('/loja.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/loja.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/login.html'));
});

app.get('/cadastro.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/cadastro.html'));
});

app.get('/perfil.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/perfil.html'));
});

// Rota para checar o status de login
app.get('/status', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Rota de logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout.');
        }
        res.status(200).send('Logout realizado com sucesso.');
    });
});

// Rota para obter as peças
app.get('/pecas', (req, res) => {
    res.json(pecas);
});

// Exemplo de uma nova rota para "comprar" que exige login
app.post('/comprar/:pecaId', requireLogin, (req, res) => {
    const pecaId = parseInt(req.params.pecaId);
    const userId = req.session.userId;
    // Lógica para processar a compra da peça com o ID `pecaId` para o usuário `userId`
    res.status(200).send(`Peça ${pecaId} comprada com sucesso pelo usuário ${userId}!`);
});

// Exemplo de uma nova rota para "trocar" que exige login
app.post('/trocar/:pecaId', requireLogin, (req, res) => {
    const pecaId = parseInt(req.params.pecaId);
    const userId = req.session.userId;
    // Lógica para processar a troca da peça com o ID `pecaId` para o usuário `userId`
    res.status(200).send(`Solicitação de troca da peça ${pecaId} enviada com sucesso pelo usuário ${userId}!`);
});


// Rota para cadastro
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const usuarioExistente = usuarios.find(user => user.email === email);
    if (usuarioExistente) {
        return res.status(409).send('Já existe um usuário com este e-mail.');
    }

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha,
        pecas: [] // Cada usuário tem um array de peças
    };

    usuarios.push(novoUsuario);
    console.log('Novo usuário cadastrado:', novoUsuario);

    req.session.userId = novoUsuario.id;
    req.session.user = { nome: novoUsuario.nome, email: novoUsuario.email, id: novoUsuario.id };

    res.redirect('/perfil.html');
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const usuario = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuario) {
        req.session.userId = usuario.id;
        req.session.user = { nome: usuario.nome, email: usuario.email, id: usuario.id };
        console.log('Login bem-sucedido:', usuario);
        res.redirect('/perfil.html');
    } else {
        res.status(401).send('E-mail ou senha incorretos.');
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});