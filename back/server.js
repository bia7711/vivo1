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

// Rota de cadastro para criar novo usuário
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Verificar se usuário já existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).send('E-mail já cadastrado.');
    }

    // Criar novo usuário
    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha, // Em produção, isso deveria ser criptografado
        dataCriacao: new Date()
    };

    usuarios.push(novoUsuario);
    
    // Autenticar o usuário automaticamente após cadastro
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

    // Verificar se o usuário existe
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        req.session.userId = usuario.id; // Define o userId na sessão
        req.session.save((err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar sessão');
            }
            return res.status(200).send('Usuário autenticado com sucesso!');
        });
        return; // Impede que o código continue executando
    }

});

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

// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado');
    }
    next();
};

// Rota para obter todas as peças
app.get('/pecas', verificarAutenticacao, (req, res) => {
    res.json(pecas);
});

// Rota para verificar status de login e obter informações do usuário
app.get('/status', (req, res) => {
    if (req.session.userId) {
        const usuario = usuarios.find(u => u.id === req.session.userId);
        res.json({
            loggedIn: true,
            user: usuario ? { nome: usuario.nome, email: usuario.email } : null
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
app.get('/pecas-usuario', (req, res) => {
    const userId = req.session.userId;
    
    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const userPecas = pecas.filter(peca => peca.idUsuario === userId);
    res.json(userPecas);
});

// Rota para adicionar nova peça
app.post('/adicionar-peca', upload.single('imagem'), (req, res) => {
    const { titulo, descricao, categoria, preco } = req.body;
    const userId = req.session.userId;

    console.log('User ID:', userId); // Adicionando log para verificar o userId

    if (!userId) {
        return res.status(401).send('Você precisa estar logado para cadastrar uma peça.');
    }

    if (!titulo || !descricao || !categoria) {
        return res.status(400).send('Título, descrição e categoria são obrigatórios.');
    }

    const novaPeca = {
        id: pecas.length + 1,
        titulo,
        descricao,
        categoria,
        preco: preco ? parseFloat(preco) : null,
        isPremium: false,
        idUsuario: userId,
        imagem: req.file ? `/uploads/pecas/${req.file.filename}` : null
    };

    pecas.push(novaPeca);
    res.status(201).send('Peça cadastrada com sucesso!');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
