const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, payer } = req.body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    id: item.id.toString(),
                    title: item.name,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.price),
                    currency_id: 'BRL'
                })),
                payer: {
                    name: payer?.name || '',
                    email: payer?.email || ''
                },
                back_urls: {
                    success: `${req.headers.origin || 'https://santh.vercel.app'}/pages/sucesso.html`,
                    failure: `${req.headers.origin || 'https://santh.vercel.app'}/pages/erro.html`,
                    pending: `${req.headers.origin || 'https://santh.vercel.app'}/pages/pendente.html`
                },
                auto_return: 'approved',
                notification_url: `${req.headers.origin || 'https://santh.vercel.app'}/api/webhook`,
                external_reference: `SANTH-${Date.now()}`
            }
        });

        return res.status(200).json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point
        });
    } catch (error) {
        console.error('Mercado Pago error:', error);
        return res.status(500).json({ error: error.message });
    }
};
