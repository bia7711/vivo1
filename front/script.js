document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const loggedInButtons = document.getElementById('loggedInButtons');
    const loggedOutButtons = document.getElementById('loggedOutButtons');
    const logoutButton = document.getElementById('logoutButton');
    const pecasContainer = document.getElementById('pecasContainer');
    const loadingMessage = document.getElementById('loadingMessage');
    const filterButtons = document.querySelectorAll('.filter-button');
    let allPecas = [];

    // Peças de exemplo para exibir se a loja estiver vazia
    const pecasDeExemplo = [
    { id: 'ex-1', titulo: "Camiseta Monalisa Preta", descricao: "Pouco usada, ideal para qualquer ocasião.", tipo: "Troca", categoria: "Masculino", imagem: "/image/mona.png" },
    { id: 'ex-2', titulo: "Calça Jeans", descricao: "Calça de marca, em excelente estado.", tipo: "Troca", categoria: "Feminino", imagem: "/image/calca.jpg" },
    { id: 'ex-3', titulo: "Jaqueta de Couro", descricao: "Jaqueta vintage de alta qualidade.", tipo: "Venda", preco: 189.90, categoria: "Masculino", imagem: "/image/jaqueta.jpg" },
    { id: 'ex-4', titulo: "Vestido Floral", descricao: "Vestido leve, com estampa vibrante.", tipo: "Troca", categoria: "Feminino", imagem: "/image/vestido.jpg" },
    { id: 'ex-5', titulo: "Blusa de Frio", descricao: "Blusa de lã para crianças, muito quentinha.", tipo: "Troca", categoria: "Infantil", imagem: "/image/blusa.jpg" },
    { id: 'ex-6', titulo: "Tênis Casual", descricao: "Tênis esportivo, poucas marcas de uso.", tipo: "Venda", preco: 120.00, categoria: "Masculino", imagem: "/image/tenis.jpg" },
    { id: 'ex-7', titulo: "Shorts Infantil", descricao: "Shorts de algodão, confortável para brincar.", tipo: "Troca", categoria: "Infantil", imagem: "/image/shortkids.jpg" }
];

    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('active');
    });

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/status');
            const data = await response.json();
            
            if (data.loggedIn) {
                loggedInButtons.classList.remove('hidden');
                loggedInButtons.classList.add('flex');
                loggedOutButtons.classList.add('hidden');
            } else {
                loggedOutButtons.classList.remove('hidden');
                loggedOutButtons.classList.add('flex');
                loggedInButtons.classList.add('hidden');
            }
        } catch (error) {
            console.error('Erro ao verificar status de login:', error);
        }
    };
    
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });

    const renderPecas = (pecasToRender) => {
        pecasContainer.innerHTML = '';
        if (pecasToRender.length === 0) {
            pecasContainer.innerHTML = '<p class="text-center font-bold text-secondary col-span-full">Nenhuma peça encontrada.</p>';
            return;
        }
        pecasToRender.forEach(peca => {
            const card = document.createElement('div');
            card.className = 'peca-card relative p-4';
            
            const precoDisplay = peca.tipo === 'Venda' ? `R$ ${peca.preco.toFixed(2).replace('.', ',')}` : 'Troca';
const actionButtonText = peca.tipo === 'Venda' ? 'Comprar' : 'Propor Troca';
            
            card.innerHTML = `
                <img src="${peca.imagem}" alt="${peca.titulo}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-bold text-primary mb-2">${peca.titulo}</h3>
                <p class="text-secondary mb-4">${peca.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-green-600">${precoDisplay}</span>
                    <button class="bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 transition-colors action-button" data-peca-id="${peca.id}" data-action="${peca.tipo.toLowerCase()}">
                        ${actionButtonText}
                    </button>
                </div>
            `;
            pecasContainer.appendChild(card);
        });

        // Adiciona o event listener para os botões de ação
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const pecaId = event.target.getAttribute('data-peca-id');
                // Redireciona para a página de produtos com o ID da peça
                window.location.href = `produtos.html?id=${pecaId}`;
            });
        });
    };

    const loadAllPecas = async () => {
        try {
            const response = await fetch('/pecas');
            const pecasDoServidor = await response.json();
            
            if (pecasDoServidor.length > 0) {
                allPecas = pecasDoServidor;
            } else {
                allPecas = defaultPecas;
            }
            
            loadingMessage.classList.add('hidden');
            renderPecas(allPecas);
        } catch (error) {
            console.error('Erro ao carregar as peças:', error);
            loadingMessage.textContent = 'Erro ao carregar as peças. Exibindo peças de exemplo...';
            allPecas = defaultPecas;
            renderPecas(allPecas);
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoria = button.getAttribute('data-categoria');
            let pecasFiltradas = [];

            if (categoria === 'Todos') {
                pecasFiltradas = allPecas;
            } else {
                pecasFiltradas = allPecas.filter(peca => peca.categoria === categoria);
            }
            renderPecas(pecasFiltradas);
        });
    });

    // Função para atualizar notificações
    const atualizarNotificacoes = async () => {
        try {
            const response = await fetch('/notificacoes/contagem');
            if (response.ok) {
                const data = await response.json();
                const badge = document.getElementById('notificationBadge');
                
                if (data.contagem > 0) {
                    badge.classList.remove('hidden');
                    badge.textContent = data.contagem;
                } else {
                    badge.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar notificações:', error);
        }
    };

    // Configurar botão de notificações
    const configurarBotaoNotificacoes = () => {
        const negotiationsButton = document.getElementById('negotiationsButton');
        if (negotiationsButton) {
            negotiationsButton.addEventListener('click', () => {
                window.location.href = 'negociacoes.html';
            });
        }
    };

    checkLoginStatus();
    loadAllPecas();
    configurarBotaoNotificacoes();
    
    // Atualizar notificações inicialmente e a cada 30 segundos
    atualizarNotificacoes();
    setInterval(atualizarNotificacoes, 30000);
});
