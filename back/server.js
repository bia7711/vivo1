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

// Configuração da sessão
app.use(session({
    secret: 'seu-segredo-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Rota de login para simular autenticação
app.post('/login', (req, res) => {
    const { userId } = req.body; // Supondo que o userId é enviado no corpo da requisição

    if (userId) {
        req.session.userId = userId; // Define o userId na sessão
        return res.status(200).send('Usuário autenticado com sucesso!');
    }

    return res.status(400).send('Usuário não fornecido.');
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

// Rota para obter todas as peças
app.get('/pecas', (req, res) => {
    res.json(pecas);
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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
