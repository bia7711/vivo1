const tips = [
    "Experimente adicionar patches coloridos em suas roupas para um toque único.",
    "Transforme uma camiseta velha em uma bolsa estilosa cortando e costurando.",
    "Use tintas para tecido para personalizar suas roupas com desenhos ou padrões.",
    "Experimente a técnica de tie-dye para dar uma nova vida a peças brancas.",
    "Adicione rendas ou babados para um visual mais feminino em roupas simples."
];

// Função para fornecer dicas de customização
function getCustomizationTip() {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
}

class Chatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.initializeElements();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    initializeElements() {
        this.toggleButton = document.getElementById('chatbotToggle');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendMessage');
        this.closeButton = document.getElementById('closeChat');
        this.quickReplies = document.getElementById('quickReplies');
    }

    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick replies
        this.quickReplies.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const question = e.target.getAttribute('data-question');
                this.addMessage(question, 'user');
                this.processMessage(question);
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatWindow.contains(e.target) && 
                !this.toggleButton.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.add('open');
            this.userInput.focus();
        } else {
            this.chatWindow.classList.remove('open');
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('open');
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
this.userInput.value = '';
        await this.processMessage(message);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Salvar no histórico
        this.messages.push({ text, type, timestamp: new Date() });
        this.saveChatHistory();
    }

    async processMessage(message) {
        console.log("Processando mensagem:", message); // Log antes de processar a mensagem
        this.showTypingIndicator();
        
        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        this.hideTypingIndicator();
        
        const response = this.getResponse(message);
        console.log("Resposta obtida:", response); // Log da resposta obtida
        this.addMessage(response, 'bot');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>Assistente está digitando</span>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        console.log("Mensagem recebida:", message); // Log da mensagem recebida
        
        // Mapeamento de intenções para respostas
        const responses = {
            // Saudação
            'olá': 'Olá! 👋 Como posso ajudar você hoje no ReUse Jovem?',
            'oi': 'Oi! 😊 Em que posso ajudar?',
            'ola': 'Olá! 👋 Como posso ajudar você hoje?',
            'hello': 'Hello! 👋 Welcome to ReUse Jovem!',
            'hi': 'Hi there! 😊 How can I help you?',
            
            // Funcionamento do site e informações adicionais
            'como funciona': 'O ReUse Jovem é uma plataforma onde você pode trocar ou vender roupas! 🌱\n\n• 📦 Cadastre suas peças\n• 🔄 Faça trocas com outros usuários\n• 💰 Venda peças premium\n• 📱 Acompanhe suas negociações\n\nQuer saber mais sobre alguma funcionalidade específica?',
            'como funciona o site': 'Nosso site permite que você:\n\n1️⃣ Cadastre peças de roupa para troca ou venda\n2️⃣ Explore peças de outros usuários\n3️⃣ Negocie trocas diretamente\n4️⃣ Venda peças por preços justos\n5️⃣ Gerencie seu perfil e histórico\n\nTudo de forma sustentável e econômica! ♻️',
            
            // Cadastro
            'como me cadastrar': 'Para se cadastrar:\n\n1️⃣ Clique em "Criar Conta" no menu\n2️⃣ Preencha seus dados (nome, email, telefone)\n3️⃣ Crie uma senha segura\n4️⃣ Pronto! Você já pode começar a usar 🎉\n\nPrecisa de ajuda com algum passo específico?',
            'cadastro': 'O cadastro é rápido e gratuito! 📝\n\nVocê precisa:\n• Nome completo\n• Email válido\n• Telefone para contato\n• Senha (mínimo 6 caracteres)\n\nApós cadastrar, você pode começar a cadastrar suas peças!',
            'como criar conta': 'Para criar sua conta:\n\n1️⃣ Vá para a página inicial\n2️⃣ Clique em "Criar Conta"\n3️⃣ Preencha o formulário\n4️⃣ Confirme seus dados\n5️⃣ Faça login e comece a usar! 🚀',
            
            // Cadastro de peças
            'como cadastrar uma peça': 'Para cadastrar uma peça:\n\n1️⃣ Faça login na sua conta\n2️⃣ Vá para "Meu Perfil"\n3️⃣ Clique em "Cadastrar Peça"\n4️⃣ Preencha as informações:\n   - Título e descrição\n   - Categoria (Masculino/Feminino/Infantil)\n   - Tipo (Troca ou Venda)\n   - Preço (se for venda)\n   - Foto da peça\n5️⃣ Clique em salvar! 📸\n\nSua peça aparecerá na loja para outros usuários.',
            'cadastrar peça': 'Excelente! Para cadastrar:\n\n✅ Acesse seu perfil\n✅ Clique em "Cadastrar Nova Peça"\n✅ Adicione foto e informações\n✅ Escolha se é para troca ou venda\n✅ Defina preço se for venda\n✅ Publique! 🎯\n\nDica: Boas fotos aumentam as chances de troca/venda!',
            
            // Trocas
            'como fazer uma troca': 'Para fazer uma troca:\n\n1️⃣ Encontre uma peça que goste na Loja\n2️⃣ Clique em "Negociar"\n3️⃣ Selecione uma das suas peças para oferecer\n4️⃣ Envie a proposta\n5️⃣ Aguarde a resposta do dono da peça\n\n💡 Dica: Ofereça peças em bom estado para aumentar as chances!',
            'fazer troca': 'O processo de troca:\n\n🔍 Encontre peças na loja\n🤝 Clique em "Negociar"\n📦 Selecione o que você oferece\n📤 Envie a proposta\n⏰ Aguarde a resposta\n✅ Se aceito, combine a entrega\n\nAs trocas são feitas diretamente entre usuários!',
            'como negociar': 'Para negociar uma troca:\n\n1️⃣ Encontre uma peça que deseja\n2️⃣ Verifique se você tem peças para oferecer\n3️⃣ Selecione a peça que vai trocar\n4️⃣ Envie a proposta\n5️⃣ Acompanhe na página "Negociações"\n\n📞 Se a proposta for aceita, você receberá os contatos para combinar a entrega!',
            
            // Vendas
            'como vender': 'Para vender uma peça:\n\n1️⃣ Cadastre a peça como "Venda" no seu perfil\n2️⃣ Defina um preço justo\n3️⃣ Adicione boas fotos\n4️⃣ Aguarde interessados\n5️⃣ Quando alguém comprar, combine a entrega\n\n💰 Você recebe o valor diretamente!',
            'vender peça': 'Para vender:\n\n✅ Cadastre a peça como tipo "Venda"\n✅ Defina o preço\n✅ Adicione fotos claras\n✅ Escreva uma descrição detalhada\n✅ Publique na loja\n\n📊 Peças premium com boas fotos vendem mais rápido!',
            
            // Categorias
            'categorias': 'Temos 3 categorias principais:\n\n👕 Masculino - Roupas masculinas\n👚 Feminino - Roupas femininas\n👶 Infantil - Roupas infantis\n\nVocê pode filtrar por categoria na loja para encontrar exatamente o que procura! 🔍',
            'que categorias tem': 'Nossas categorias:\n\n• 👔 Masculino\n• 👗 Feminino  \n• 🧒 Infantil\n\nDentro de cada categoria, você encontra diversos tipos de peças: camisetas, calças, vestidos, etc.!',
            
            // Problemas técnicos
            'não consigo logar': 'Problemas para fazer login? Tente:\n\n1️⃣ Verificar se o email está correto\n2️⃣ Confirmar a senha\n3️⃣ Tentar recuperar senha\n4️⃣ Limpar cache do navegador\n5️⃣ Tentar em outro navegador\n\nSe persistir, entre em contato com o suporte!',
            'esqueci a senha': 'Para recuperar sua senha:\n\n1️⃣ Vá para a página de login\n2️⃣ Clique em "Esqueci minha senha"\n3️⃣ Informe seu email cadastrado\n4️⃣ Siga as instruções no email\n\n📧 Você receberá um link para redefinir sua senha!',
            'problema': 'Desculpe pelo problema! 😔\n\nPoderia me dar mais detalhes?\n• Não consegue fazer login?\n• Problema ao cadastrar peça?\n• Erro em alguma página?\n\nOu prefere falar diretamente com nosso suporte!',
            
            // Informações da empresa
            'sobre': 'ReUse Jovem ♻️\n\nSomos uma plataforma dedicada à moda sustentável!\n\n🎯 Missão: Reduzir o desperdício têxtil\n💚 Visão: Comunidade consciente de consumo\n🌟 Valores: Sustentabilidade, Economia, Comunidade\n\nJuntos por uma moda mais circular! 🌍',
            'quem somos': 'Somos o ReUse Jovem! 👥\n\nUma comunidade de jovens preocupados com:\n• ♻️ Sustentabilidade ambiental\n• 💰 Economia circular\n• 👕 Reutilização de roupas\n• 🤝 Conexões entre pessoas\n\nTrabalhamos para um futuro mais consciente!',
            
            // Contato
            'contato': 'Precisa falar conosco? 📞\n\n• 📧 Email: contato@reusejovem.com\n• 📱 WhatsApp: (11) 99999-9999\n• 🕒 Horário: Seg-Sex, 9h-18h\n\nEstamos aqui para ajudar! 💚',
            'suporte': 'Para suporte técnico:\n\n📧 contato@reusejovem.com\n📞 (11) 99999-9999\n\nHorário de atendimento:\nSegunda a Sexta, 9h às 18h\n\nRespondemos o mais rápido possível! ⚡',
            
            // Default
            'default': 'Desculpe, não entendi completamente. 😅\n\nPosso ajudar com:\n• Como funciona o site\n• Cadastro e login\n• Cadastro de peças\n• Trocas e negociações\n• Vendas\n• Problemas técnicos\n\nO que você gostaria de saber? 🤔'
        };

        // Buscar resposta correspondente
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // Se não encontrar match, usar resposta default
        return responses.default;
    }

    saveChatHistory() {
        localStorage.setItem('chatbot_history', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type}-message`;
                messageDiv.textContent = msg.text;
                this.chatMessages.appendChild(messageDiv);
            });
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    clearHistory() {
        this.messages = [];
        this.chatMessages.innerHTML = '';
        localStorage.removeItem('chatbot_history');
        this.addMessage('Olá! 👋 Sou o assistente virtual da ReUse Jovem. Como posso ajudar você hoje?', 'bot');
    }
}

// Inicializar o chatbot quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});

// Função global para abrir o chatbot programaticamente
window.openChatbot = function() {
    if (window.chatbot) {
        window.chatbot.toggleChat();
    }
};

// Função global para fechar o chatbot
window.closeChatbot = function() {
    if (window.chatbot) {
        window.chatbot.closeChat();
    }
};

// Função para enviar mensagem programaticamente
window.sendChatbotMessage = function(message) {
    if (window.chatbot) {
        window.chatbot.addMessage(message, 'user');
        window.chatbot.processMessage(message);
    }
};
