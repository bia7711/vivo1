document.addEventListener('DOMContentLoaded', () => {
    // VARIÁVEL PARA SIMULAR O ESTADO DE LOGIN
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const productsData = [
        { id: 1, name: "Camiseta Branca", description: "Perfeita para o dia a dia, em bom estado.", price: null, isPremium: false, category: "Camisetas", gender: "masculina", size: "M", image: "https://placehold.co/400x400/FFF/000?text=Camiseta+Branca" },
        { id: 2, name: "Camiseta Preta", description: "Pouco usada, ideal para qualquer ocasião.", price: null, isPremium: false, category: "Camisetas", gender: "masculina", size: "G", image: "https://placehold.co/400x400/000/FFF?text=Camiseta+Preta" },
        { id: 3, name: "Calça Jeans", description: "Calça de marca, em excelente estado.", price: null, isPremium: false, category: "Calças", gender: "feminina", size: "P", image: "https://placehold.co/400x400/6B7280/FFF?text=Calça+Jeans" },
        { id: 4, name: "Jaqueta de Couro", description: "Jaqueta vintage de alta qualidade.", price: 189.90, isPremium: true, category: "Jaquetas", gender: "masculina", size: "GG", image: "https://placehold.co/400x400/292524/E5E7EB?text=Jaqueta+de+Couro" },
        { id: 5, name: "Vestido Floral", description: "Vestido leve, com estampa vibrante.", price: null, isPremium: false, category: "Vestidos", gender: "feminina", size: "M", image: "https://placehold.co/400x400/FCA5A5/FFF?text=Vestido+Floral" },
        { id: 6, name: "Blusa de Frio", description: "Blusa de lã para crianças, muito quentinha.", price: null, isPremium: false, category: "Blusas", gender: "infantil", size: "P", image: "https://placehold.co/400x400/FDBA74/FFF?text=Blusa+de+Frio" },
        { id: 7, name: "Tênis Casual", description: "Tênis esportivo, poucas marcas de uso.", price: 120.00, isPremium: true, category: "Calçados", gender: "masculina", size: "G", image: "https://placehold.co/400x400/9CA3AF/FFF?text=Tênis+Casual" },
        { id: 8, name: "Saia Plissada", description: "Saia elegante, perfeita para eventos.", price: null, isPremium: false, category: "Saias", gender: "feminina", size: "P", image: "https://placehold.co/400x400/F472B6/FFF?text=Saia+Plissada" },
        { id: 9, name: "Shorts Infantil", description: "Shorts de algodão, confortável para brincar.", price: null, isPremium: false, category: "Shorts", gender: "infantil", size: "M", image: "https://placehold.co/400x400/34D399/FFF?text=Shorts+Infantil" }
    ];

    const userItems = [
        { id: 101, name: "Camiseta Azul", image: "https://placehold.co/400x400/3B82F6/FFF?text=Camiseta+Azul", size: "M" },
        { id: 102, name: "Moletom Cinza", image: "https://placehold.co/400x400/6B7280/FFF?text=Moletom+Cinza", size: "G" },
        { id: 103, name: "Saia Verde", image: "https://placehold.co/400x400/10B981/FFF?text=Saia+Verde", size: "P" }
    ];

    const reviewsData = {
        1: [{ user: "Ana S.", rating: 5, comment: "Adorei a camiseta! O tecido é muito macio." }],
        3: [{ user: "Maria C.", rating: 5, comment: "Perfeita! Veste super bem." }],
        5: [{ user: "Clara G.", rating: 5, comment: "O vestido é lindo e super confortável!" }]
    };

    const gridContainer = document.getElementById('gridContainer');
    const productDetailsModal = document.getElementById('productDetailsModal');
    const closeProductDetailsModal = document.getElementById('closeProductDetailsModal');
    const productDetailsContent = document.getElementById('productDetailsContent');
    const proposeTradeModal = document.getElementById('proposeTradeModal');
    const closeProposeTradeModal = document.getElementById('closeProposeTradeModal');
    const userItemsForTrade = document.getElementById('userItemsForTrade');
    const tradeTargetProductName = document.getElementById('tradeTargetProductName');
    const negotiationsButton = document.getElementById('negotiationsButton');
    const negotiationsModal = document.getElementById('negotiationsModal');
    const closeNegotiationsModal = document.getElementById('closeNegotiationsModal');
    const negotiationsItems = document.getElementById('negotiationsItems');
    const negotiationsCount = document.getElementById('negotiationsCount');
    const reviewsModal = document.getElementById('reviewsModal');
    const closeReviewsModal = document.getElementById('closeReviewsModal');
    const homeButton = document.getElementById('homeButton');
    const premiumItemsButton = document.getElementById('premiumItemsButton');
    const tradeItemsButton = document.getElementById('tradeItemsButton');
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const body = document.body;

    // Seções da página de loja
    const productsSection = document.getElementById('productsSection');
    const productsTitle = document.getElementById('productsTitle');
    const profileLink = document.getElementById('profileLink');
    const menuToggleIcon = document.getElementById('menuToggle');

    let activeNegotiations = [];
    let currentTradeProductId = null;
    
    // Funções de renderização e controle (o mesmo código que você já tinha)
    const renderStars = (rating) => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fa-star ${i <= rating ? 'fas text-yellow-400' : 'far text-gray-300'}"></i>`;
        }
        return starsHtml;
    };

    const renderProducts = (productsToRender) => {
        gridContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            gridContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Nenhum produto encontrado.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product bg-white rounded-lg shadow-md flex flex-col overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300';
            productDiv.dataset.productId = product.id;

            const premiumTag = product.isPremium ? '<span class="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">Premium</span>' : '';
            
            const priceText = product.isPremium
                ? `<p class="text-xl font-bold text-green-700">R$ ${product.price.toFixed(2).replace('.', ',')}</p>`
                : `<p class="text-lg font-semibold text-blue-500">Para Troca</p>`;

            productDiv.innerHTML = `
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                    ${premiumTag}
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h2 class="text-xl font-bold text-gray-800 mb-1">${product.name}</h2>
                    <p class="text-sm text-gray-600 mb-2 flex-grow">${product.description}</p>
                    <p class="text-sm font-semibold text-gray-700 mb-4">Tamanho: ${product.size}</p>
                    <div class="mt-auto">${priceText}</div>
                </div>
            `;
            gridContainer.appendChild(productDiv);
        });
    };
    
    const showProductDetails = (productId) => {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        let actionButtonHtml = '';
        if (isLoggedIn) {
            actionButtonHtml = product.isPremium
            ? `<button data-product-id="${product.id}" class="buy-btn bg-green-500 text-white text-lg px-6 py-3 rounded-full hover:bg-green-600 transition-colors w-full md:w-auto"><i class="fas fa-shopping-bag mr-2"></i> Comprar por R$ ${product.price.toFixed(2).replace('.', ',')}</button>`
            : `<button data-product-id="${product.id}" class="propose-trade-btn bg-blue-500 text-white text-lg px-6 py-3 rounded-full hover:bg-blue-600 transition-colors w-full md:w-auto"><i class="fas fa-arrows-left-right mr-2"></i> Propor Troca</button>`;
        } else {
            actionButtonHtml = `<p class="text-sm text-gray-500 mb-4">Faça login para realizar negociações.</p>
                                <a href="login.html" class="bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition-colors transform hover:scale-105 w-full md:w-auto text-center">Entrar ou Cadastrar</a>`;
        }

        productDetailsContent.innerHTML = `
            <div class="md:flex md:space-x-8">
                <div class="md:w-1/2"><img src="${product.image}" alt="${product.name}" class="w-full h-auto object-cover rounded-md mb-4"></div>
                <div class="md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h3 class="text-3xl font-extrabold text-gray-900 mb-2">${product.name}</h3>
                        <p class="text-gray-700 mb-4">${product.description}</p>
                        <div class="space-y-2 mb-6">
                            <p class="text-gray-600"><span class="font-semibold">Categoria:</span> ${product.category}</p>
                            <p class="text-gray-600"><span class="font-semibold">Tamanho:</span> ${product.size}</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        ${actionButtonHtml}
                        <button data-product-id="${product.id}" class="show-reviews-btn bg-gray-200 text-gray-700 text-lg px-6 py-3 rounded-full hover:bg-gray-300 transition-colors w-full md:w-auto"><i class="fas fa-star mr-2"></i> Avaliações</button>
                    </div>
                </div>
            </div>
        `;
        
        if (isLoggedIn) {
            document.querySelector('#productDetailsContent .propose-trade-btn')?.addEventListener('click', () => {
                currentTradeProductId = productId;
                openProposeTradeModal(productId);
                productDetailsModal.classList.add('hidden');
            });
            document.querySelector('#productDetailsContent .buy-btn')?.addEventListener('click', () => {
                buyPremiumItem(productId);
                productDetailsModal.classList.add('hidden');
            });
        }

        document.querySelector('#productDetailsContent .show-reviews-btn')?.addEventListener('click', () => {
            showReviews(productId);
            productDetailsModal.classList.add('hidden');
        });
        
        productDetailsModal.classList.remove('hidden');
    };

    const proposeTrade = (targetProductId, userItemId) => {
        const targetProduct = productsData.find(p => p.id === targetProductId);
        const userItem = userItems.find(p => p.id === userItemId);
        if (targetProduct && userItem) {
            activeNegotiations.push({ targetProduct, userItem });
            updateNegotiationsDisplay();
            alert(`Proposta de troca enviada: Você ofereceu "${userItem.name}" em troca de "${targetProduct.name}"!`);
        }
    };
    
    const openProposeTradeModal = (targetProductId) => {
        const targetProduct = productsData.find(p => p.id === targetProductId);
        if (!targetProduct) return;

        tradeTargetProductName.textContent = `"${targetProduct.name}"`;
        userItemsForTrade.innerHTML = '';

        if (userItems.length === 0) {
            document.getElementById('userItemsEmptyMessage').classList.remove('hidden');
        } else {
            document.getElementById('userItemsEmptyMessage').classList.add('hidden');
            userItems.forEach(item => {
                const userItemDiv = document.createElement('button');
                userItemDiv.className = 'flex items-center space-x-4 p-2 bg-gray-50 rounded-lg w-full text-left hover:bg-gray-200 transition-colors';
                userItemDiv.dataset.userItemId = item.id;
                userItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-grow"><h4 class="font-semibold">${item.name}</h4><p class="text-sm text-gray-500">Tamanho: ${item.size}</p></div>
                    <span class="text-green-500 font-bold">Oferecer</span>
                `;
                userItemsForTrade.appendChild(userItemDiv);
            });
        }
        proposeTradeModal.classList.remove('hidden');
    };

    const buyPremiumItem = (productId) => {
        const productToBuy = productsData.find(p => p.id === productId);
        if (productToBuy) {
            alert(`Item premium "${productToBuy.name}" comprado por R$ ${productToBuy.price.toFixed(2).replace('.', ',')}.`);
        }
    };

    const updateNegotiationsDisplay = () => {
        negotiationsItems.innerHTML = '';
        if (activeNegotiations.length === 0) {
            document.getElementById('negotiationsEmptyMessage').classList.remove('hidden');
        } else {
            document.getElementById('negotiationsEmptyMessage').classList.add('hidden');
            activeNegotiations.forEach(item => {
                const negotiationItemDiv = document.createElement('div');
                negotiationItemDiv.className = 'flex items-center space-x-4 p-2 bg-gray-50 rounded-lg';
                negotiationItemDiv.innerHTML = `
                    <img src="${item.targetProduct.image}" alt="${item.targetProduct.name}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-grow"><h4 class="font-semibold">${item.targetProduct.name}</h4><p class="text-sm text-gray-500">Negociação em andamento...</p></div>
                `;
                negotiationsItems.appendChild(negotiationItemDiv);
            });
        }
        negotiationsCount.textContent = activeNegotiations.length;
    };

    const showReviews = (productId) => {
        const product = productsData.find(p => p.id === productId);
        const reviews = reviewsData[productId];
        reviewsTitle.textContent = `Avaliações para ${product.name}`;
        reviewsContent.innerHTML = '';
        if (reviews && reviews.length > 0) {
            document.getElementById('reviewsEmptyMessage').classList.add('hidden');
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'border-b border-gray-200 pb-4';
                reviewDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-1"><span class="font-bold">${review.user}</span><div class="text-sm">${renderStars(review.rating)}</div></div>
                    <p class="text-gray-700">${review.comment}</p>
                `;
                reviewsContent.appendChild(reviewDiv);
            });
        } else {
            document.getElementById('reviewsEmptyMessage').classList.remove('hidden');
        }
        reviewsModal.classList.remove('hidden');
    };

    // Event Listeners
    gridContainer.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product');
        if (productCard) {
            const productId = parseInt(productCard.dataset.productId);
            showProductDetails(productId);
        }
    });

    closeProductDetailsModal.addEventListener('click', () => productDetailsModal.classList.add('hidden'));
    closeProposeTradeModal.addEventListener('click', () => proposeTradeModal.classList.add('hidden'));
    userItemsForTrade.addEventListener('click', (e) => {
        const userItemButton = e.target.closest('button[data-user-item-id]');
        if (userItemButton) {
            const userItemId = parseInt(userItemButton.dataset.userItemId);
            if (currentTradeProductId) {
                proposeTrade(currentTradeProductId, userItemId);
                proposeTradeModal.classList.add('hidden');
            }
        }
    });
    
    negotiationsButton.addEventListener('click', () => {
        negotiationsModal.classList.remove('hidden');
    });

    closeNegotiationsModal.addEventListener('click', () => negotiationsModal.classList.add('hidden'));
    closeReviewsModal.addEventListener('click', () => reviewsModal.classList.add('hidden'));

    homeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    premiumItemsButton.addEventListener('click', () => {
        productsTitle.textContent = "Itens Premium";
        renderProducts(productsData.filter(p => p.isPremium));
        menuList.classList.remove('active');
        body.classList.remove('no-scroll');
    });
    tradeItemsButton.addEventListener('click', () => {
        productsTitle.textContent = "Itens de Troca";
        renderProducts(productsData.filter(p => !p.isPremium));
        menuList.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    const initializePage = () => {
        if (isLoggedIn) {
            // Se o usuário estiver logado, a página inicial padrão é a loja
            productsTitle.textContent = "Itens Premium";
            renderProducts(productsData.filter(p => p.isPremium));
            profileLink.href = "perfil.html";
        } else {
            // Se o usuário não estiver logado, ele é redirecionado para a página de boas-vindas
            window.location.href = 'index.html'; 
        }
    };

    initializePage();
    updateNegotiationsDisplay();
});