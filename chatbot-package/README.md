# Pacote do Chatbot ReUse Jovem

Este pacote contém todos os arquivos necessários para integrar o chatbot em qualquer projeto.

## 📦 Arquivos Incluídos

- `chatbot.html` - Estrutura HTML completa
- `chatbot.js` - Lógica JavaScript do chatbot  
- `chatbot.css` - Estilos CSS completos
- `integration-example.html` - Exemplo de integração

## 🚀 Como Usar

### Método 1: Copiar e colar diretamente

1. **Copie este código HTML** para o final do seu arquivo HTML (antes do `</body>`):

```html
<!-- Chatbot de Ajuda - ReUse Jovem -->
<div class="chatbot-container">
    <button class="chatbot-button" id="chatbotToggle" title="Abrir chatbot de ajuda">
        <i class="fas fa-comments" aria-hidden="true"></i>
        <span class="sr-only">Abrir chatbot de ajuda</span>
    </button>
    
    <div class="chat-window" id="chatWindow">
        <div class="chat-header">
            <h3>Assistente Virtual ReUse</h3>
            <button class="close-button" id="closeChat" title="Fechar chatbot">
                <i class="fas fa-times" aria-hidden="true"></i>
                <span class="sr-only">Fechar chatbot</span>
            </button>
        </div>
        
        <div class="chat-messages" id="chatMessages">
            <div class="message bot-message">
                Olá! 👋 Sou o assistente virtual da ReUse Jovem. Como posso ajudar você hoje?
            </div>
        </div>
        
        <div class="quick-replies" id="quickReplies">
            <button class="quick-reply" data-question="Como funciona o site?" title="Perguntar como funciona o site">Como funciona?</button>
            <button class="quick-reply" data-question="Como me cadastrar?" title="Perguntar sobre cadastro">Cadastro</button>
            <button class="quick-reply" data-question="Como cadastrar uma peça?" title="Perguntar sobre cadastro de peças">Cadastrar peça</button>
            <button class="quick-reply" data-question="Como fazer uma troca?" title="Perguntar sobre trocas">Fazer troca</button>
        </div>
        
        <div class="chat-input">
            <input type="text" id="userInput" placeholder="Digite sua mensagem..." maxlength="500" aria-label="Digite sua mensagem para o assistente virtual">
            <button id="sendMessage" title="Enviar mensagem">
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
                <span class="sr-only">Enviar mensagem</span>
            </button>
        </div>
    </div>
</div>

<!-- Inclua estas dependências no <head> -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<script src="chatbot.js"></script>
<style>
/* Cole aqui todo o conteúdo do arquivo chatbot.css */
</style>
```

2. **Copie o JavaScript** para um arquivo `chatbot.js` no seu projeto.

### Método 2: Usar os arquivos diretamente

1. Copie os arquivos `chatbot.js` e `chatbot.css` para o seu projeto
2. Adicione o HTML do chatbot no seu arquivo
3. Inclua as dependências necessárias

## 📋 Dependências

- Font Awesome 6.4.0 (para ícones)
- Nenhuma outra dependência obrigatória

## 🎯 Funcionalidades

- ✅ Chat em tempo real
- ✅ Respostas automáticas inteligentes  
- ✅ Histórico de conversas (localStorage)
- ✅ Botões de resposta rápida
- ✅ Design responsivo
- ✅ Modo claro/escuro
- ✅ Animações suaves
- ✅ Totalmente acessível

## 🔧 Personalização

Para personalizar as respostas, edite o método `getResponse()` no arquivo `chatbot.js`:

```javascript
// Adicione novas respostas
const responses = {
    'minha pergunta': 'Sua resposta personalizada aqui',
    // ... outras respostas
};
```

## 📞 Controle Programático

```javascript
// Abrir o chatbot
window.openChatbot();

// Fechar o chatbot
window.closeChatbot();

// Enviar mensagem programaticamente  
window.sendChatbotMessage('Olá, preciso de ajuda');
```

O chatbot está pronto para uso! 🚀
