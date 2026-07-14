// Products Database - SANTH
const PRODUCTS = [
    {
        id: 8,
        name: "Black Ops",
        subtitle: "Performance extrema em qualquer terreno",
        category: "corrida",
        price: 109.90,
        oldPrice: null,
        badge: "Novo",
        colors: ["#000000"],
        colorNames: ["Preto"],
        images: ["img/black-ops-glass.webp", "img/black-ops-2.webp"],
        description: "Óculos esportivo para corrida e ciclismo com lente UV400 fotocromática. Lente antiembaçante, material resistente a impacto, encaixe em silicone e opção fotocromática. Leve, seguro e compatível com capacetes.",
        specs: [
            "Lente UV400 Fotocromática",
            "Lente Antiembaçante",
            "Material Resistente a Impacto",
            "Encaixe em Silicone",
            "Leve e Seguro",
            "Compatível com Capacetes"
        ],
        payment: {
            pix: 98.91,
            card: 109.90,
            installments: "4x de R$ 27,48"
        }
    },
    {
        id: 7,
        name: "SANTH Essential",
        subtitle: "Estilo e conforto no dia a dia",
        category: "corrida",
        price: 89.90,
        oldPrice: null,
        badge: "Novo",
        colors: ["#000000", "#ffffff"],
        colorNames: ["Preto", "Branco"],
        images: ["img/produto-7.jpeg", "img/essential2.webp"],
        description: "O SANTH Essential é perfeito para quem busca estilo e conforto no dia a dia. Design moderno com proteção UV400, lente de alta qualidade e armação leve. Ideal para uso casual, trabalho ou passeios.",
        specs: [
            "Lente com Proteção UV400",
            "Armação Leve e Resistente",
            "Design Moderno e Versátil",
            "Conforto para Uso Diário",
            "Acabamento Premium"
        ],
        payment: {
            pix: 80.91,
            card: 89.90,
            installments: "4x de R$ 22,48"
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
