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
    const defaultPecas = [
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
            const actionButtonText = peca.tipo === 'Venda' ? 'Comprar' : 'Negociar';
            
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
                const action = event.target.getAttribute('data-action');

                const response = await fetch(`/${action}/${pecaId}`, {
                    method: 'POST'
                });
                const message = await response.text();
                alert(message);
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

    checkLoginStatus();
    loadAllPecas();
});