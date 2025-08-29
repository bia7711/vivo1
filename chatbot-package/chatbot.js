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
        const lowerMessage = removerAcento(message.toLowerCase());
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
            'cadastro e login': 'O cadastro é rápido e gratuito! 📝\n\nVocê precisa:\n• Nome completo\n• Email válido\n• Telefone para contato\n• Senha (mínimo 6 caracteres)\n\nApós cadastrar, você pode começar a cadastrar suas peças!',
            'como criar conta': 'Para criar sua conta:\n\n1️⃣ Vá para a página inicial\n2️⃣ Clique em "Criar Conta"\n3️⃣ Preencha o formulário\n4️⃣ Confirme seus dados\n5️⃣ Faça login e comece a usar! 🚀',
            
            // Cadastro de peças
            'como cadastrar uma peca': 'Para cadastrar uma peça:\n\n1️⃣ Faça login na sua conta\n2️⃣ Vá para "Meu Perfil"\n3️⃣ Clique em "Cadastrar Peça"\n4️⃣ Preencha as informações:\n   - Título e descrição\n   - Categoria (Masculino/Feminino/Infantil)\n   - Tipo (Troca ou Venda)\n   - Preço (se for venda)\n   - Foto da peça\n5️⃣ Clique em salvar! 📸\n\nSua peça aparecerá na loja para outros usuários.',
            'cadastrar peca': 'Excelente! Para cadastrar:\n\n✅ Acesse seu perfil\n✅ Clique em "Cadastrar Nova Peça"\n✅ Adicione foto e informações\n✅ Escolha se é para troca ou venda\n✅ Defina preço se for venda\n✅ Publique! 🎯\n\nDica: Boas fotos aumentam as chances de troca/venda!',
            
            // Trocas
            'como fazer uma troca': 'Para fazer uma troca:\n\n1️⃣ Encontre uma peça que goste na Loja\n2️⃣ Clique em "Negociar"\n3️⃣ Selecione uma das suas peças para oferecer\n4️⃣ Envie a proposta\n5️⃣ Aguarde a resposta do dono da peça\n\n💡 Dica: Ofereça peças em bom estado para aumentar as chances!',
            'fazer troca': 'O processo de troca:\n\n🔍 Encontre peças na loja\n🤝 Clique em "Negociar"\n📦 Selecione o que você oferece\n📤 Envie a proposta\n⏰ Aguarde a resposta\n✅ Se aceito, combine a entrega\n\nAs trocas são feitas diretamente entre usuários!',
            'como negociar': 'Para negociar uma troca:\n\n1️⃣ Encontre uma peça que deseja\n2️⃣ Verifique se você tem peças para oferecer\n3️⃣ Selecione a peça que vai trocar\n4️⃣ Envie a proposta\n5️⃣ Acompanhe na página "Negociações"\n\n📞 Se a proposta for aceita, você receberá os contatos para combinar a entrega!',
            
            // Vendas
            'como vender': 'Para vender uma peça:\n\n1️⃣ Cadastre a peça como "Venda" no seu perfil\n2️⃣ Defina um preço justo\n3️⃣ Adicione boas fotos\n4️⃣ Aguarde interessados\n5️⃣ Quando alguém comprar, combine a entrega\n\n💰 Você recebe o valor diretamente!',
            'vender peca': 'Para vender:\n\n✅ Cadastre a peça como tipo "Venda"\n✅ Defina o preço\n✅ Adicione fotos claras\n✅ Escreva uma descrição detalhada\n✅ Publique na loja\n\n📊 Peças premium com boas fotos vendem mais rápido!',
            
            // Categorias
            'categorias': 'Temos 3 categorias principais:\n\n👕 Masculino - Roupas masculinas\n👚 Feminino - Roupas femininas\n👶 Infantil - Roupas infantis\n\nVocê pode filtrar por categoria na loja para encontrar exatamente o que procura! 🔍',
            'que categorias tem': 'Nossas categorias:\n\n• 👔 Masculino\n• 👗 Feminino  \n• 🧒 Infantil\n\nDentro de cada categoria, você encontra diversos tipos de peças: camisetas, calças, vestidos, etc.!',
            
            // Problemas técnicos
            'nao consigo logar': 'Problemas para fazer login? Tente:\n\n1️⃣ Verificar se o email está correto\n2️⃣ Confirmar a senha\n3️⃣ Tentar recuperar senha\n4️⃣ Limpar cache do navegador\n5️⃣ Tentar em outro navegador\n\nSe persistir, entre em contato com o suporte!',
            'esqueci a senha': 'Para recuperar sua senha:\n\n1️⃣ Vá para a página de login\n2️⃣ Clique em "Esqueci minha senha"\n3️⃣ Informe seu email cadastrado\n4️⃣ Siga as instruções no email\n\n📧 Você receberá um link para redefinir sua senha!',
            'problema': 'Desculpe pelo problema! 😔\n\nPoderia me dar mais detalhes?\n• Não consegue fazer login?\n• Problema ao cadastrar peça?\n• Erro em alguma página?\n\nOu prefere falar diretamente com nosso suporte!',
            'ajuda': 'Olá! Parece que você precisa de ajuda 😊\n\nEscolha uma das opções abaixo ou me conte mais detalhes:\n• Como funciona o Customizar peça?\n• Como usar a peça?\n• Problemas com o chat ou alguma página?\n\nOu, se preferir, você pode falar diretamente com nosso suporte!',


            // Informações da empresa
            'sobre': 'ReUse Jovem ♻️\n\nSomos uma plataforma dedicada à moda sustentável!\n\n🎯 Missão: Reduzir o desperdício têxtil\n💚 Visão: Comunidade consciente de consumo\n🌟 Valores: Sustentabilidade, Economia, Comunidade\n\nJuntos por uma moda mais circular! 🌍',
            'quem somos': 'Somos o ReUse Jovem! 👥\n\nUma comunidade de jovens preocupados com:\n• ♻️ Sustentabilidade ambiental\n• 💰 Economia circular\n• 👕 Reutilização de roupas\n• 🤝 Conexões entre pessoas\n\nTrabalhamos para um futuro mais consciente!',
            
            // Contato
            'contato': 'Precisa falar conosco? 📞\n\n• 📧 Email ctrlaltbeg@gmail.com\n• 📱 WhatsApp: (11) 98579-8579\n• 🕒 Horário: Seg-Sex, 9h-18h\n\nEstamos aqui para ajudar! 💚',
            'suporte': 'Para suporte técnico:\n\n📧 ctrlaltbeg@gmail.com\n📞 (11) 95695-9684\n\nHorário de atendimento:\nSegunda a Sexta, 9h às 18h\n\nRespondemos o mais rápido possível! ⚡',
            'sim': 'Me informe qual, para que eu possa te ajudar.',

            'como fazer uma troca': 'Para fazer uma troca:\n\n1️⃣ Encontre uma peça que goste na Loja\n2️⃣ Clique em "Propor Troca"\n3️⃣ Selecione uma das suas peças para oferecer\n4️⃣ Envie a proposta\n5️⃣ Aguarde a resposta do dono da peça\n\n💡 Dica: Ofereça peças em bom estado para aumentar as chances!',

            'customizar peca': 'Claro! 😃 Qual peça e qual cor você gostaria de customizar?\n\n📌 Exemplo: "camiseta azul" ou "calça preta"\n\nAssim posso sugerir uma customização criativa para você.',

            'cadastro de pecas': 'Para cadastrar uma peça:\n\n1️⃣ Vá até o seu "Perfil"\n2️⃣ Clique em "Adicionar nova peça"\n3️⃣ Preencha as informações: tipo, cor, tamanho e descrição\n4️⃣ Adicione fotos da peça\n5️⃣ Clique em "Salvar"\n\n💡 Dica: Fotos bem iluminadas aumentam as chances de negociação!',

            'trocas e negociacoes': 'As trocas e negociações funcionam assim:\n\n1️⃣ Escolha uma peça que você goste\n2️⃣ Clique em "Propor Troca"\n3️⃣ Ofereça uma das suas peças em troca\n4️⃣ Aguarde a resposta do dono da peça\n\n💡 Negociações amigáveis costumam gerar melhores resultados 😉',

            'vendas': 'Para vender uma peça:\n\n1️⃣ Acesse seu "Perfil"\n2️⃣ Clique em "Adicionar peça"\n3️⃣ Defina que é "Venda" e acrescente o valor desejado\n4️⃣ Aguarde interessados enviarem propostas ou realizarem a compra\n\n💡 Coloque valores justos (abaixo do mínimo) para atrair mais compradores.',

            'default': 'Desculpe, não entendi completamente. Hmm, não encontrei essa peça exata 😅\nVocê poderia ser menos específico(a)? Por exemplo: "camiseta azul" ou "calça preta".😅\n\nTambém posso ajudar com:\n• Como funciona o site\n• Cadastro e login\n• Cadastro de peças\n• Trocas e negociações\n• Vendas\n• Customizar peças\n• Combinar looks\n• Problemas técnicos\n\n📌 Entre em contato pelo suporte: suporte@reuse.com\n\nO que você gostaria de saber? 🤔',
            'combinar looks': 'Claro! 😃 Me diga qual peça você está com dúvida e com o que ela combina.\n\n📌 Exemplo: "camiseta azul" ou "saia preta"\n\nAssim posso sugerir combinações estilosas para você.',

  // CAMISETAS / BLUSAS / MOLETONS
  'camiseta preta': 'Combina com calças de qualquer cor clara ou escura; para customização, pode adicionar bordados coloridos ou transformar em cropped.',
  'camiseta branca': 'Combina com calças coloridas ou neutras; pode ser tingida com tie-dye ou ter estampas minimalistas.',
  'camiseta azul': 'Combina com calças claras ou neutras, evita cores quentes; pode virar regata ou ganhar detalhes em tecido contrastante.',
  'camiseta vermelha': 'Combina com calças neutras como preto, branco ou jeans; customização sugerida: mangas cortadas ou estampa frontal.',
  'camiseta verde': 'Combina com calças bege, branca ou jeans; pode receber patches ou bordados na gola.',
  'camiseta amarela': 'Combina melhor com tons neutros como cinza, branco ou azul escuro; customização: tie-dye em degradê ou corte lateral.',
  'camiseta cinza': 'Combina com praticamente todas as cores de calça; customização: estampa minimalista ou gola diferenciada.',
  'camiseta bege': 'Combina com cores escuras ou jeans; customização: pode ganhar franjas ou mangas diferenciadas.',
  'camiseta marrom': 'Combina com calças claras como bege ou branco; customização: pintura em tecido ou patches rústicos.',

  'blusa preta': 'Combina com qualquer calça ou saia; customização: bordados coloridos ou capuz removível.',
  'blusa branca': 'Combina com cores vibrantes ou neutras; customização: tie-dye ou mangas diferenciadas.',
  'blusa azul': 'Combina com calças claras ou jeans; customização: patches ou estampa minimalista.',
  'blusa vermelha': 'Combina com tons neutros; customização: recortes ou mangas bufantes.',
  'blusa verde': 'Combina com tons claros; customização: bordados ou costura contrastante.',
  'blusa amarela': 'Combina com tons neutros ou jeans; customização: tie-dye ou mangas curtas.',
  'blusa cinza': 'Combina com qualquer cor de calça; customização: gola diferenciada ou estampa frontal.',
  'blusa bege': 'Combina com cores escuras ou jeans; customização: franjas ou detalhes em renda.',
  'blusa marrom': 'Combina com tons claros; customização: pintura em tecido ou patches decorativos.',

  'moletom preto': 'Combina com calças claras ou escuras; customização: mangas cortadas ou estampa frontal.',
  'moletom branco': 'Combina com cores neutras; customização: tie-dye ou capuz decorativo.',
  'moletom azul': 'Combina com calças neutras; customização: bolso frontal ou patch de tecido.',
  'moletom vermelho': 'Combina com calças escuras; customização: estampa minimalista ou mangas bufantes.',
  'moletom verde': 'Combina com tons neutros; customização: recortes laterais ou bordados.',
  'moletom amarelo': 'Combina com tons neutros ou jeans; customização: tie-dye ou capuz removível.',
  'moletom cinza': 'Combina com qualquer cor; customização: gola diferenciada ou bolso frontal.',
  'moletom bege': 'Combina com cores escuras ou neutras; customização: franjas ou estampa simples.',
  'moletom marrom': 'Combina com tons claros; customização: patches ou detalhes costurados.',

  // CALÇAS
  'calca preta': 'Combina com camisetas de qualquer cor; customização: rasgos estratégicos ou barra dobrada.',
  'calca branca': 'Combina com camisetas escuras ou coloridas; customização: tingimento parcial ou bolsos personalizados.',
  'calca azul': 'Combina com camisetas neutras como branco, cinza ou preto; customização: efeito destroyed ou pintura de tecido.',
  'calca verde': 'Combina com camisetas neutras ou tons terrosos; customização: patches camuflados ou bordados laterais.',
  'calca bege': 'Combina com camisetas escuras ou claras; customização: barra cortada ou cordão decorativo.',
  'calca cinza': 'Combina com cores vibrantes ou neutras; customização: detalhes costurados ou tie-dye suave.',
  'calca marrom': 'Combina com camisetas claras como branco ou bege; customização: rasgos discretos ou pintura artística.',

  // SAIAS
  'saia preta': 'Combina com blusas coloridas ou neutras; customização: franjas ou bordados na barra.',
  'saia branca': 'Combina com blusas escuras ou coloridas; customização: tingimento ou aplicação de renda.',
  'saia azul': 'Combina com blusas neutras como branco ou cinza; customização: botões decorativos ou barra assimétrica.',
  'saia vermelha': 'Combina com blusas neutras ou pretas; customização: babados ou detalhes em tecido contrastante.',
  'saia verde': 'Combina com blusas claras ou neutras; customização: estampas pintadas à mão ou patches laterais.',
  'saia bege': 'Combina com blusas escuras ou coloridas; customização: franjas ou cintos decorativos.',
  'saia cinza': 'Combina com cores vivas ou neutras; customização: bordados discretos ou efeito tie-dye.',
  'saia marrom': 'Combina com blusas claras ou neutras; customização: costura decorativa ou babados.',

  // VESTIDOS
  'vestido preto': 'Combina com acessórios coloridos ou neutros; customização: corte na cintura ou detalhes em renda.',
  'vestido branco': 'Combina com sapatos coloridos ou neutros; customização: tingimento parcial ou aplicação de franjas.',
  'vestido azul': 'Combina com acessórios neutros ou prata; customização: botões decorativos ou mangas diferenciadas.',
  'vestido vermelho': 'Combina com sapatos neutros ou dourados; customização: recortes laterais ou babados.',
  'vestido verde': 'Combina com sapatos bege ou branco; customização: estampas florais ou patches de tecido.',
  'vestido bege': 'Combina com acessórios escuros ou coloridos; customização: cintura marcada ou detalhes em renda.',
  'vestido cinza': 'Combina com acessórios vibrantes ou neutros; customização: franjas ou barras assimétricas.',
  'vestido marrom': 'Combina com sapatos claros ou neutros; customização: detalhes costurados ou patchwork.',

  // JAQUETAS / CASACOS
  'jaqueta preta': 'Combina com qualquer roupa básica ou colorida; customização: zíperes decorativos ou patches.',
  'jaqueta branca': 'Combina com roupas escuras ou neutras; customização: tingimento parcial ou botões coloridos.',
  'jaqueta azul': 'Combina com calças neutras ou jeans; customização: patches bordados ou manga cortada.',
  'jaqueta verde': 'Combina com tons terrosos ou neutros; customização: capuz removível ou franjas.',
  'jaqueta bege': 'Combina com roupas escuras ou claras; customização: detalhes em couro ou botões decorativos.',
  'jaqueta cinza': 'Combina com cores vibrantes ou neutras; customização: costura contrastante ou bolsos extras.',
  'jaqueta marrom': 'Combina com tons neutros ou claros; customização: costura rústica ou patches.',

  'casaco preto': 'Combina com qualquer roupa básica ou colorida; customização: zíperes decorativos ou capuz removível.',
  'casaco branco': 'Combina com roupas escuras ou neutras; customização: tingimento parcial ou botões coloridos.',
  'casaco azul': 'Combina com calças neutras; customização: patches bordados ou detalhes no ombro.',
  'casaco verde': 'Combina com tons terrosos; customização: capuz removível ou franjas.',
  'casaco bege': 'Combina com roupas claras ou escuras; customização: detalhes em couro ou costura decorativa.',
  'casaco cinza': 'Combina com cores vibrantes ou neutras; customização: bolsos extras ou zíper contrastante.',
  'casaco marrom': 'Combina com tons neutros ou terrosos; customização: costura rústica ou bordados.',

  // SHORTS
  'short preto': 'Combina com camisetas coloridas ou neutras; customização: barras desfiadas ou estampas laterais.',
  'short branco': 'Combina com camisetas escuras ou coloridas; customização: tingimento parcial ou franjas.',
  'short azul': 'Combina com camisetas neutras; customização: patches ou detalhes em tecido contrastante.',
  'short vermelho': 'Combina com camisetas neutras; customização: corte lateral ou bordados simples.',
  'short verde': 'Combina com camisetas claras ou neutras; customização: estampa pintada ou franjas.',
  'short bege': 'Combina com camisetas escuras ou coloridas; customização: barra cortada ou cordão decorativo.',
  'short cinza': 'Combina com camisetas vibrantes ou neutras; customização: bolsos decorativos ou tie-dye leve.',
  'short marrom': 'Combina com camisetas claras; customização: pintura em tecido ou patches.',

  // TÊNIS / SAPATOS / SANDÁLIAS
  'tenis preto': 'Combina com qualquer roupa casual; customização: cadarços coloridos ou pintura artesanal.',
  'tenis branco': 'Combina com roupas claras ou coloridas; customização: pintura, adesivos ou cadarços diferentes.',
  'tenis azul': 'Combina com roupas neutras ou jeans; customização: detalhes em tecido contrastante.',
  'tenis vermelho': 'Combina com tons neutros ou jeans; customização: cadarços diferentes ou pintura artística.',
  'tenis verde': 'Combina com cores neutras ou terrosas; customização: patches ou cadarços diferenciados.',
  'tenis bege': 'Combina com tons neutros ou pastéis; customização: pintura leve ou bordados.',
  'tenis cinza': 'Combina com qualquer cor neutra ou vibrante; customização: cadarços coloridos ou pintura suave.',
  'tenis marrom': 'Combina com tons neutros ou terrosos; customização: costura decorativa ou patches.',

  'sapato preto': 'Combina com qualquer roupa formal ou casual; customização: pintura decorativa ou fivelas.',
  'sapato branco': 'Combina com roupas coloridas ou neutras; customização: detalhes em tecido ou fivelas coloridas.',
  'sapato azul': 'Combina com tons neutros ou jeans; customização: cadarços coloridos ou detalhes pintados.',
  'sapato vermelho': 'Combina com tons neutros; customização: fivelas decorativas ou pequenos recortes.',
  'sapato verde': 'Combina com roupas claras ou neutras; customização: pintura ou costura artesanal.',
  'sapato bege': 'Combina com tons neutros ou pastéis; customização: franjas ou bordados discretos.',
  'sapato cinza': 'Combina com roupas claras ou neutras; customização: detalhes em tecido ou pintura suave.',
  'sapato marrom': 'Combina com tons terrosos ou neutros; customização: fivelas, costuras ou pintura leve.',

  'sandalia preta': 'Combina com roupas claras ou coloridas; customização: tiras decorativas ou pintura.',
  'sandalia branca': 'Combina com roupas coloridas ou neutras; customização: pedrarias ou franjas.',
  'sandalia azul': 'Combina com roupas neutras; customização: tiras coloridas ou detalhes bordados.',
  'sandalia vermelha': 'Combina com roupas neutras; customização: pedrarias ou tiras contrastantes.',
  'sandalia verde': 'Combina com tons claros; customização: detalhes bordados ou franjas.',
  'sandalia bege': 'Combina com roupas claras ou neutras; customização: tiras decorativas ou pequenas franjas.',
  'sandalia cinza': 'Combina com qualquer roupa; customização: pedrarias discretas ou detalhes em tiras.',
  'sandalia marrom': 'Combina com tons terrosos; customização: tiras decorativas ou costura artesanal.',

  // CHAPÉUS / BONÉS
  'chapeu preto': 'Combina com qualquer look casual; customização: fitas ou patches.',
  'chapeu branco': 'Combina com roupas coloridas ou neutras; customização: bordados ou fitas coloridas.',
  'chapeu azul': 'Combina com tons neutros; customização: patches ou costura contrastante.',
  'chapeu vermelho': 'Combina com roupas neutras; customização: fitas decorativas ou bordados.',
  'chapeu verde': 'Combina com tons terrosos; customização: detalhes em tecido ou patches.',
  'chapeu bege': 'Combina com roupas claras ou neutras; customização: fitas ou franjas.',
  'chapeu cinza': 'Combina com qualquer roupa; customização: bordados minimalistas.',
  'chapeu marrom': 'Combina com tons terrosos; customização: fitas ou detalhes artesanais.',

  'bone preto': 'Combina com qualquer roupa casual; customização: bordados ou patches.',
  'bone branco': 'Combina com roupas coloridas ou neutras; customização: tingimento parcial ou estampas.',
  'bone azul': 'Combina com roupas neutras; customização: patches ou bordados.',
  'bone vermelho': 'Combina com roupas neutras; customização: estampa frontal ou costura contrastante.',
  'bone verde': 'Combina com tons terrosos; customização: detalhes bordados ou patches.',
  'bone bege': 'Combina com roupas claras; customização: bordados discretos ou costura decorativa.',
  'bone cinza': 'Combina com qualquer roupa; customização: patches minimalistas.',
  'bone marrom': 'Combina com tons terrosos; customização: detalhes bordados ou costura artesanal.',

  // MOCHILAS / BOLSAS
  'mochila preta': 'Combina com qualquer look casual; customização: adesivos, patches ou bordados.',
  'mochila branca': 'Combina com roupas escuras ou coloridas; customização: tingimento parcial ou pintura.',
  'mochila azul': 'Combina com roupas neutras ou jeans; customização: bordados ou detalhes coloridos.',
  'mochila vermelha': 'Combina com roupas neutras; customização: patches ou pintura decorativa.',
  'mochila verde': 'Combina com tons neutros ou terrosos; customização: detalhes bordados ou franjas.',
  'mochila bege': 'Combina com roupas claras ou neutras; customização: costura decorativa ou pequenos patches.',
  'mochila cinza': 'Combina com roupas claras ou neutras; customização: bordados minimalistas ou adesivos.',
  'mochila marrom': 'Combina com tons terrosos; customização: patches ou costura decorativa.',

  'bolsa preta': 'Combina com qualquer look; customização: adesivos, patches ou bordados.',
  'bolsa branca': 'Combina com roupas escuras ou coloridas; customização: pintura ou tingimento parcial.',
  'bolsa azul': 'Combina com roupas neutras ou jeans; customização: bordados ou detalhes coloridos.',
  'bolsa vermelha': 'Combina com roupas neutras; customização: patches ou pintura decorativa.',
  'bolsa verde': 'Combina com tons neutros ou terrosos; customização: detalhes bordados ou franjas.',
  'bolsa bege': 'Combina com roupas claras ou neutras; customização: costura decorativa ou pequenos patches.',
  'bolsa cinza': 'Combina com roupas claras ou neutras; customização: bordados minimalistas ou adesivos.',
  'bolsa marrom': 'Combina com tons terrosos; customização: patches ou costura decorativa.',

 'cachecol preto': 'Combina com qualquer look; customização: franjas ou bordados discretos.',
  'cachecol branco': 'Combina com roupas escuras ou coloridas; customização: estampas leves ou franjas.',
  'cachecol azul': 'Combina com tons neutros; customização: costura contrastante ou pequenas aplicações.',
  'cachecol vermelho': 'Combina com tons neutros; customização: franjas decorativas ou bordados simples.',
  'cachecol verde': 'Combina com tons terrosos; customização: bordados ou costura artesanal.',
  'cachecol bege': 'Combina com tons claros; customização: franjas ou pequenas aplicações decorativas.',
  'cachecol cinza': 'Combina com qualquer roupa; customização: bordados minimalistas ou franjas discretas.',
  'cachecol marrom': 'Combina com tons terrosos; customização: franjas ou costura artesanal.',

    'cinto preto': 'Combina com qualquer look casual ou formal; customização: fivela decorativa ou bordado discreto.',
  'cinto branco': 'Combina com roupas escuras ou coloridas; customização: fivela colorida ou franjas.',
  'cinto azul': 'Combina com tons neutros ou jeans; customização: costura decorativa ou pequenos detalhes coloridos.',
  'cinto vermelho': 'Combina com tons neutros; customização: fivela contrastante ou pintura artesanal.',
  'cinto verde': 'Combina com tons terrosos ou neutros; customização: bordado ou detalhes em tecido.',
  'cinto bege': 'Combina com tons claros; customização: costura decorativa ou franjas discretas.',
  'cinto cinza': 'Combina com qualquer roupa; customização: bordado minimalista ou fivela diferenciada.',
  'cinto marrom': 'Combina com tons terrosos; customização: costura artesanal ou detalhes em couro.',
        
  'bota preta': 'Combina com calças escuras ou neutras; customização: fivelas decorativas ou costura contrastante.',
  'bota branca': 'Combina com roupas neutras ou coloridas; customização: pintura parcial ou franjas.',
  'bota azul': 'Combina com jeans ou tons neutros; customização: cadarços coloridos ou bordados.',
  'bota vermelha': 'Combina com tons neutros; customização: detalhes em couro ou pintura artesanal.',
  'bota verde': 'Combina com tons neutros ou terrosos; customização: costura decorativa ou bordados.',
  'bota bege': 'Combina com tons claros; customização: franjas ou pequenos patches.',
  'bota cinza': 'Combina com roupas claras ou neutras; customização: fivelas decorativas ou costura minimalista.',
  'bota marrom': 'Combina com tons terrosos; customização: costura rústica ou detalhes em couro.',

    'chinelo preto': 'Combina com roupas casuais e cores neutras; customização: tiras coloridas ou pintura artesanal.',
  'chinelo branco': 'Combina com roupas claras ou coloridas; customização: tiras decorativas ou pequenos patches.',
  'chinelo azul': 'Combina com tons neutros; customização: tiras contrastantes ou bordados simples.',
  'chinelo vermelho': 'Combina com tons neutros; customização: tiras coloridas ou pintura artesanal.',
  'chinelo verde': 'Combina com roupas claras ou neutras; customização: tiras decorativas ou pequenos bordados.',
  'chinelo bege': 'Combina com roupas claras; customização: tiras decorativas ou franjas.',
  'chinelo cinza': 'Combina com qualquer roupa; customização: tiras minimalistas ou pintura suave.',
  'chinelo marrom': 'Combina com tons terrosos; customização: tiras decorativas ou costura artesanal.',

'calca jeans': 'Combina com camisetas claras ou neutras; customização: rasgos, barra dobrada ou tingimento leve.',
'shorts jeans': 'Combina com camisetas neutras ou coloridas; customização: barra desfiada ou patches decorativos.',
'jaqueta jeans ': 'Combina com qualquer camiseta básica ou blusa; customização: patches, bordados ou mangas cortadas.',
'jaqueta de couro': 'Combina com calças neutras ou escuras; customização: tachas, bordados ou zíperes decorativos.',
'vestido estampado': 'Combina com sapatos neutros ou sandálias; customização: ajuste na cintura, franjas ou pequenas aplicações decorativas.',
'tenis branco': 'Combina com roupas claras ou coloridas; customização: cadarços coloridos, pintura artesanal ou adesivos decorativos.'
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

function removerAcento(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// Função para enviar mensagem programaticamente
window.sendChatbotMessage = function(message) {
    if (window.chatbot) {
        window.chatbot.addMessage(message, 'user');
        window.chatbot.processMessage(message);
    }
};
