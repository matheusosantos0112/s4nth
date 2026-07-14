// Products Database - SANTH (Supabase + fallback)
const PRODUCTS_FALLBACK = [
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

async function getProducts() {
    try {
        if (typeof _supabase === 'undefined') return PRODUCTS_FALLBACK;
        const { data, error } = await _supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
            return data.map(p => ({
                id: p.id,
                name: p.name,
                subtitle: p.subtitle,
                category: p.category,
                price: parseFloat(p.price),
                oldPrice: p.old_price ? parseFloat(p.old_price) : null,
                badge: p.badge,
                colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || []),
                colorNames: typeof p.color_names === 'string' ? JSON.parse(p.color_names) : (p.color_names || []),
                images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
                description: p.description,
                specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || []),
                payment: typeof p.payment === 'string' ? JSON.parse(p.payment) : (p.payment || {})
            }));
        }
        return PRODUCTS_FALLBACK;
    } catch (e) {
        console.warn('Supabase fallback:', e);
        return PRODUCTS_FALLBACK;
    }
}

async function getAllProducts() {
    try {
        if (typeof _supabase === 'undefined') return PRODUCTS_FALLBACK;
        const { data, error } = await _supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(p => ({
            id: p.id,
            name: p.name,
            subtitle: p.subtitle,
            category: p.category,
            price: parseFloat(p.price),
            oldPrice: p.old_price ? parseFloat(p.old_price) : null,
            badge: p.badge,
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || []),
            colorNames: typeof p.color_names === 'string' ? JSON.parse(p.color_names) : (p.color_names || []),
            images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
            description: p.description,
            specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || []),
            payment: typeof p.payment === 'string' ? JSON.parse(p.payment) : (p.payment || {}),
            active: p.active,
            created_at: p.created_at
        }));
    } catch (e) {
        console.warn('Supabase getAllProducts fallback:', e);
        return PRODUCTS_FALLBACK;
    }
}

async function addProduct(product) {
    const { data, error } = await _supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
}

async function updateProduct(id, updates) {
    const { data, error } = await _supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

async function deleteProduct(id) {
    const { error } = await _supabase.from('products').delete().eq('id', id);
    if (error) throw error;
}

async function saveOrder(order) {
    const { data, error } = await _supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    return data;
}

async function getOrders() {
    const { data, error } = await _supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function updateOrderStatus(id, status) {
    const { data, error } = await _supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
}
