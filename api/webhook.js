const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).end();
    }

    try {
        const { type, data } = req.body;
        console.log('Webhook received:', type, data);

        if (type === 'payment') {
            const supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
            );

            const paymentId = data?.id;
            if (!paymentId) return res.status(200).send('OK');

            const mpToken = process.env.MP_ACCESS_TOKEN;
            const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: { 'Authorization': `Bearer ${mpToken}` }
            });
            const payment = await paymentRes.json();

            if (payment.status === 'approved') {
                const preferenceId = payment.external_reference;
                if (preferenceId) {
                    await supabase
                        .from('orders')
                        .update({ status: 'paid', mp_preference_id: preferenceId })
                        .eq('id', preferenceId);
                }
            }
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(200).send('OK');
    }
};
