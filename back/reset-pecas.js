// Script para limpar e reinicializar o array de peças
const fs = require('fs');
const path = require('path');

// Simular o mesmo array do servidor
let pecas = [];

// Adicionar algumas peças de teste bem formatadas
const pecasTeste = [
    {
        id: 1,
        titulo: "Camiseta Teste 1",
        descricao: "Descrição da camiseta teste 1",
        categoria: "Masculino",
        tipo: "Troca",
        preco: null,
        preferencia: "Roupas casuais",
        isPremium: false,
        idUsuario: 1,
        imagem: null
    },
    {
        id: 2,
        titulo: "Calça Jeans Teste",
        descricao: "Descrição da calça jeans teste",
        categoria: "Feminino",
        tipo: "Venda",
        preco: 89.90,
        preferencia: null,
        isPremium: false,
        idUsuario: 1,
        imagem: null
    },
    {
        id: 3,
        titulo: "Vestido Floral",
        descricao: "Vestido floral para verão",
        categoria: "Feminino",
        tipo: "Troca",
        preco: null,
        preferencia: "Vestidos",
        isPremium: false,
        idUsuario: 2,
        imagem: null
    }
];

// Adicionar as peças de teste
pecas = [...pecasTeste];

// Testar o JSON gerado
console.log("=== TESTE DE FORMATO JSON ===");
const jsonTeste = JSON.stringify(pecas, null, 2);
console.log(jsonTeste);

// Verificar se o JSON é válido
try {
    const parsed = JSON.parse(jsonTeste);
    console.log("✅ JSON válido!");
    console.log("Número de peças:", parsed.length);
    
    // Testar busca por ID
    const peca1 = parsed.find(p => p.id == 1);
    console.log("Peça com ID 1 encontrada:", peca1 ? peca1.titulo : "Não encontrada");
    
    const peca2 = parsed.find(p => p.id == 2);
    console.log("Peça com ID 2 encontrada:", peca2 ? peca2.titulo : "Não encontrada");
    
} catch (error) {
    console.log("❌ JSON inválido:", error.message);
}

console.log("\n=== INSTRUÇÕES ===");
console.log("1. Pare o servidor atual (Ctrl+C)");
console.log("2. Substitua o array 'pecas' no server.js por:");
console.log("const pecas = " + JSON.stringify(pecasTeste, null, 2) + ";");
console.log("3. Reinicie o servidor");
