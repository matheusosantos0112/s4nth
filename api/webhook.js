module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(200).end();
    }

    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            console.log('Payment notification received:', data);
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(200).send('OK');
    }
};
