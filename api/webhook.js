module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(200).end();
    }

    try {
        const { type, data } = req.body;
        console.log('Webhook received:', type, data);
        return res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(200).send('OK');
    }
};
