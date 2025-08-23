const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/profile');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nome do arquivo: userid-timestamp.extensao
    const userId = req.session.userId || 'unknown';
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `profile-${userId}-${timestamp}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limite
  },
  fileFilter: function (req, file, cb) {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
  }
});

// Simula um banco de dados em memória
const usuarios = [];
const pecas = [
    // Roupas Femininas (algumas para troca, outras para compra)
    { id: 1, titulo: "Vestido Floral", descricao: "Vestido leve e estampado para o verão.", categoria: "Feminino", preco: null, isPremium: false, idUsuario: null, imagem: "https://placehold.co/400x400/FCA5A5/FFF?text=Vestido+Floral" },
    { id: 2, titulo: "Calça Jeans Skinny", descricao: "Calça jeans azul, corte skinny, tamanho 38.", categoria: "Feminino", preco: 60.00, isPremium: true, idUsuario: null, imagem: "https://placehold.co/400x400/6B7280/FFF?text=Calça+Jeans" },
    { id: 3, titulo: "Blusa de Alcinha Branca", descricao: "Blusa básica de alcinha, ideal para combinar com qualquer look.", categoria: "Feminino", preco: null, isPremium: false, idUsuario: null, imagem: "https://placehold.co/400x400/FFF/000?text=Blusa+Alcinha" },

    // Roupas Masculinas (algumas para troca, outras para compra)
    { id: 4, titulo: "Camisa Polo Azul", descricao: "Camisa polo de piquet, cor azul marinho, tamanho M.", categoria: "Masculino", preco: null, isPremium: false, idUsuario: null, imagem: "https://placehold.co/400x400/3B82F6/FFF?text=Camisa+Polo" },
    { id: 5, titulo: "Calça Cargo Preta", descricao: "Calça cargo preta com bolsos laterais.", categoria: "Masculino", preco: 70.00, isPremium: true, idUsuario: null, imagem: "https://placehold.co/400x400/000/FFF?text=Calça+Cargo" },
    { id: 6, titulo: "Jaqueta Jeans Clássica", descricao: "Jaqueta jeans com lavagem clássica, tamanho G.", categoria: "Masculino", preco: null, isPremium: false, idUsuario: null, imagem: "https://placehold.co/400x400/1E40AF/FFF?text=Jaqueta+Jeans" },

    // Roupas Infantis (algumas para troca, outras para compra)
    { id: 7, titulo: "Macacão de Bebê", descricao: "Macacão de algodão macio para bebês de 6 a 12 meses.", categoria: "Infantil", preco: 25.00, isPremium: true, idUsuario: null, imagem: "https://placehold.co/400x400/FDBA74/FFF?text=Macacão+Bebê" },
    { id: 8, titulo: "Conjunto Camiseta e Bermuda", descricao: "Conjunto para crianças de 2 anos.", categoria: "Infantil", preco: null, isPremium: false, idUsuario: null, imagem: "https://placehold.co/400x400/34D399/FFF?text=Conjunto+Infantil" },
    { id: 9, titulo: "Vestido de Festa Infantil", descricao: "Vestido para meninas, ideal para festas, tamanho 5 anos.", categoria: "Infantil", preco: 85.00, isPremium: true, idUsuario: null, imagem: "https://placehold.co/400x400/F472B6/FFF?text=Vestido+Festa" }
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
app.use('/image', express.static(path.join(__dirname, '../image')));

// Configuração do body-parser para lidar com dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});
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
        fotoPerfil: null, // Campo para foto de perfil
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
        req.session.user = { 
            nome: usuario.nome, 
            email: usuario.email, 
            id: usuario.id,
            fotoPerfil: usuario.fotoPerfil || null
        };
        console.log('Login bem-sucedido:', usuario);
        res.redirect('/perfil.html');
    } else {
        res.status(401).send('E-mail ou senha incorretos.');
    }
});

// Rota para upload de foto de perfil
app.post('/upload-profile-photo', requireLogin, upload.single('profilePhoto'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Nenhum arquivo foi enviado.' });
        }

        const userId = req.session.userId;
        const usuario = usuarios.find(user => user.id === userId);
        
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        // Atualiza a foto de perfil do usuário
        usuario.fotoPerfil = `/uploads/profile/${req.file.filename}`;
        
        // Atualiza a sessão com a nova foto
        req.session.user.fotoPerfil = usuario.fotoPerfil;

        console.log(`Foto de perfil atualizada para o usuário ${userId}: ${usuario.fotoPerfil}`);
        
        res.json({ 
            success: true, 
            message: 'Foto de perfil atualizada com sucesso!',
            fotoPerfil: usuario.fotoPerfil
        });
    } catch (error) {
        console.error('Erro no upload da foto de perfil:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Middleware de tratamento de erro para o Multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
        }
    }
    if (error.message === 'Apenas arquivos de imagem são permitidos!') {
        return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});