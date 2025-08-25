const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware para análise de corpo de requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta front
app.use(express.static(path.join(__dirname, '../front')));

// Servir arquivos estáticos da pasta image
app.use('/image', express.static(path.join(__dirname, '../image')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração da sessão
app.use(session({
    secret: 'seu-segredo-aqui',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Defina como true se estiver usando HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads/pecas');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const userId = req.session.userId || 'unknown';
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `peca-${userId}-${timestamp}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limite
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

// Simula um banco de dados em memória
const usuarios = [];
const pecas = [];
const negociacoes = []; // NOVO ARRAY PARA ARMAZENAR AS NEGOCIAÇÕES

// Peças de exemplo para exibir se a loja estiver vazia
const pecasDeExemplo = [
    { id: 'ex-1', titulo: "Camiseta Branca", descricao: "Perfeita para o dia a dia, em bom estado.", tipo: "Troca", categoria: "Masculino", imagem: "https://placehold.co/400x400/FFF/000?text=Camiseta+Branca" },
    { id: 'ex-2', titulo: "Camiseta Preta", descricao: "Pouco usada, ideal para qualquer ocasião.", tipo: "Troca", categoria: "Masculino", imagem: "https://placehold.co/400x400/000/FFF?text=Camiseta+Preta" },
    { id: 'ex-3', titulo: "Calça Jeans", descricao: "Calça de marca, em excelente estado.", tipo: "Troca", categoria: "Feminino", imagem: "https://placehold.co/400x400/6B7280/FFF?text=Calça+Jeans" },
    { id: 'ex-4', titulo: "Jaqueta de Couro", descricao: "Jaqueta vintage de alta qualidade.", tipo: "Venda", preco: 189.90, categoria: "Masculino", imagem: "https://placehold.co/400x400/292524/E5E7EB?text=Jaqueta+de+Couro" },
    { id: 'ex-5', titulo: "Vestido Floral", descricao: "Vestido leve, com estampa vibrante.", tipo: "Troca", categoria: "Feminino", imagem: "https://placehold.co/400x400/FCA5A5/FFF?text=Vestido+Floral" },
    { id: 'ex-6', titulo: "Blusa de Frio", descricao: "Blusa de lã para crianças, muito quentinha.", tipo: "Troca", categoria: "Infantil", imagem: "https://placehold.co/400x400/FDBA74/FFF?text=Blusa+de+Frio" },
    { id: 'ex-7', titulo: "Tênis Casual", descricao: "Tênis esportivo, poucas marcas de uso.", tipo: "Venda", preco: 120.00, categoria: "Masculino", imagem: "https://placehold.co/400x400/9CA3AF/FFF?text=Tênis+Casual" },
    { id: 'ex-8', titulo: "Saia Plissada", descricao: "Saia elegante, perfeita para eventos.", tipo: "Troca", categoria: "Feminino", imagem: "https://placehold.co/400x400/F472B6/FFF?text=Saia+Plissada" },
    { id: 'ex-9', titulo: "Shorts Infantil", descricao: "Shorts de algodão, confortável para brincar.", tipo: "Troca", categoria: "Infantil", imagem: "https://placehold.co/400x400/34D399/FFF?text=Shorts+Infantil" }
];

// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    }
    next();
};

// Rota de cadastro para criar novo usuário
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).send('E-mail já cadastrado.');
    }

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha,
        dataCriacao: new Date()
    };

    usuarios.push(novoUsuario);
    
    req.session.userId = novoUsuario.id;
    req.session.save((err) => {
        if (err) {
            return res.status(500).send('Erro ao salvar sessão');
        }
        res.status(201).send('Usuário cadastrado com sucesso!');
    });
});

// Rota de login para autenticação
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        req.session.userId = usuario.id;
        req.session.save((err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar sessão');
            }
            return res.status(200).send('Usuário autenticado com sucesso!');
        });
        return;
    }
    res.status(401).send('E-mail ou senha incorretos.');
});

// Rota para obter todas as peças (reais e de exemplo)
app.get('/pecas', (req, res) => {
    const todasAsPecas = [...pecas, ...pecasDeExemplo];
    res.json(todasAsPecas);
});

// Rota para verificar status de login e obter informações do usuário
app.get('/status', (req, res) => {
    if (req.session.userId) {
        const usuario = usuarios.find(u => u.id === req.session.userId);
        const negociacoesPendentes = negociacoes.filter(n => 
            (n.idUsuarioDono === req.session.userId || n.idUsuarioInteressado === req.session.userId) && 
            n.status === 'pendente'
        ).length;

        res.json({
            loggedIn: true,
            user: usuario ? { nome: usuario.nome, email: usuario.email, fotoPerfil: usuario.fotoPerfil } : null,
            negociacoesPendentes // Adiciona a contagem de negociações
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Rota para logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout');
        }
        res.send('Logout realizado com sucesso');
    });
});

// Rota para obter peças do usuário logado
app.get('/pecas-usuario', verificarAutenticacao, (req, res) => {
    const userId = req.session.userId;
    
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const userPecas = pecas.filter(peca => peca.idUsuario === userId);
    res.json(userPecas);
});

// Rota para adicionar nova peça
app.post('/adicionar-peca', verificarAutenticacao, upload.single('imagem'), (req, res) => {
    const { titulo, descricao, categoria, tipo, preco, preferencia } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('Você precisa estar logado para cadastrar uma peça.');
    }

    if (!titulo || !descricao || !categoria || !tipo) {
        return res.status(400).send('Todos os campos obrigatórios precisam ser preenchidos.');
    }

    const novaPeca = {
        id: pecas.length + 1,
        titulo,
        descricao,
        categoria,
        tipo,
        preco: tipo === 'Venda' ? parseFloat(preco) : null,
        preferencia: tipo === 'Troca' ? preferencia : null,
        isPremium: false,
        idUsuario: userId,
        imagem: req.file ? `/uploads/pecas/${req.file.filename}` : null
    };

    pecas.push(novaPeca);
    res.status(201).send('Peça cadastrada com sucesso!');
});

// Rota para negociar uma peça (ajustada para lidar com o ID na URL)
app.post('/negociar/:pecaId', verificarAutenticacao, (req, res) => {
    const { pecaId } = req.params;
    const userId = req.session.userId;
    
    // Busca a peça real ou de exemplo
    const peca = pecas.find(p => p.id == pecaId) || pecasDeExemplo.find(p => p.id == pecaId);
    
    if (!peca) {
        return res.status(404).send('Peça não encontrada.');
    }

    if (peca.idUsuario === userId) {
        return res.status(400).send('Não é possível negociar sua própria peça.');
    }
    
    // Verifica se a negociação já existe
    const negociacaoExistente = negociacoes.find(n => n.idUsuarioInteressado === userId && n.idPeca == pecaId);
    if (negociacaoExistente) {
        return res.status(400).send('Você já iniciou uma negociação para esta peça.');
    }

    // Apenas negocia se a peça não for de exemplo
    if (typeof peca.id === 'number') {
        const novaNegociacao = {
            id: negociacoes.length + 1,
            idUsuarioInteressado: userId,
            idUsuarioDono: peca.idUsuario,
            idPeca: peca.id,
            mensagem: 'Proposta de negociação enviada.',
            status: 'pendente',
            data: new Date()
        };
        negociacoes.push(novaNegociacao);
        res.status(200).send(`Proposta de negociação enviada com sucesso para a peça "${peca.titulo}".`);
    } else {
        // Para peças de exemplo, apenas retorna uma mensagem de sucesso
        res.status(200).send(`Proposta de negociação de exemplo enviada para a peça "${peca.titulo}". (Esta é apenas uma demonstração)`);
    }
});

// Rota para comprar uma peça (ajustada para lidar com o ID na URL)
app.post('/comprar/:pecaId', verificarAutenticacao, (req, res) => {
    const { pecaId } = req.params;
    const userId = req.session.userId;

    // Busca a peça real ou de exemplo
    const peca = pecas.find(p => p.id == pecaId) || pecasDeExemplo.find(p => p.id == pecaId);

    if (!peca) {
        return res.status(404).send('Peça não encontrada.');
    }

    if (peca.idUsuario === userId) {
        return res.status(400).send('Não é possível comprar sua própria peça.');
    }

    // Apenas compra se a peça não for de exemplo
    if (typeof peca.id === 'number') {
        // Lógica de compra real aqui
        res.status(200).send(`Compra da peça "${peca.titulo}" concluída!`);
    } else {
        // Para peças de exemplo, apenas retorna uma mensagem de sucesso
        res.status(200).send(`Compra de exemplo da peça "${peca.titulo}" concluída! (Esta é apenas uma demonstração)`);
    }
});

// ROTA PARA BUSCAR AS NEGOCIAÇÕES DO USUÁRIO
app.get('/minhas-negociacoes', verificarAutenticacao, (req, res) => {
    const userId = req.session.userId;
    const minhasNegociacoes = negociacoes.filter(n => n.idUsuarioInteressado === userId || n.idUsuarioDono === userId);
    
    const negociacoesDetalhes = minhasNegociacoes.map(n => {
        const peca = pecas.find(p => p.id === n.idPeca);
        return {
            ...n,
            tituloPeca: peca ? peca.titulo : 'Peça removida',
            imagemPeca: peca ? peca.imagem : null
        };
    });

    res.json(negociacoesDetalhes);
});

// Rota para fazer upload da foto de perfil
app.post('/upload-profile-photo', verificarAutenticacao, upload.single('profilePhoto'), (req, res) => {
    const userId = req.session.userId;
    const usuario = usuarios.find(u => u.id === userId);

    if (!req.file || !usuario) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado ou usuário não encontrado.' });
    }

    // Atualiza o caminho da foto de perfil do usuário
    usuario.fotoPerfil = `/uploads/pecas/${req.file.filename}`;
    res.json({ success: true, fotoPerfil: usuario.fotoPerfil });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});