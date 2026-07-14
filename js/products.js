// Products Database - SANTH
const PRODUCTS = [
    {
        id: 7,
        name: "SANTH Essential",
        subtitle: "Estilo e conforto no dia a dia",
        category: "lifestyle",
        price: 129.90,
        oldPrice: null,
        badge: "Novo",
        colors: ["#000000"],
        colorNames: ["Preto"],
        images: ["img/produto-7.jpeg"],
        description: "O SANTH Essential é perfeito para quem busca estilo e conforto no dia a dia. Design moderno com proteção UV400, lente de alta qualidade e armação leve. Ideal para uso casual, trabalho ou passeios.",
        specs: [
            "Lente com Proteção UV400",
            "Armação Leve e Resistente",
            "Design Moderno e Versátil",
            "Conforto para Uso Diário",
            "Acabamento Premium"
        ],
        payment: {
            pix: 116.91,
            card: 129.90,
            installments: "4x de R$ 32,48"
        }
    }
];

// Load products from localStorage if available (admin uploaded)
function getProducts() {
    const stored = localStorage.getItem('santh_products');
    if (stored) {
        return JSON.parse(stored);
    }
    return PRODUCTS;
}

function saveProducts(products) {
    localStorage.setItem('santh_products', JSON.stringify(products));
}
