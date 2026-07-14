const { Resend } = require('resend');

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AMIGO-';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Email inválido.' });
        }

        const code = generateCode();
        const shareUrl = `https://s4nth.vercel.app?ref=${code}`;

        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'SANTH <onboarding@resend.dev>',
            to: email,
            subject: 'Seu cupom de 15% OFF - SANTH',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align:center; margin-bottom: 30px;">
                        <h1 style="font-size: 28px; color: #0d0d0d; margin: 0;">SANTH</h1>
                    </div>
                    <h2 style="color: #0d0d0d; text-align: center;">Voce ganhou 15% OFF!</h2>
                    <p style="color: #666; text-align: center; font-size: 16px;">Use o cupom abaixo na sua primeira compra:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; background: #f5f5f0; border: 2px dashed #0d0d0d; border-radius: 8px; padding: 16px 40px;">
                            <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #0d0d0d;">${code}</span>
                        </div>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #666; font-size: 14px; margin-bottom: 12px;">Compartilhe com seus amigos e ambos ganham desconto:</p>
                        <a href="https://wa.me/?text=${encodeURIComponent(`Ganhei 15% de desconto nos oculos SANTH! Use meu link pra ganhar o mesmo desconto: ${shareUrl}`)}" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Compartilhar no WhatsApp</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">Para usar: adicione produtos ao carrinho e digite o cupom no campo "Cupom de desconto".</p>
                </div>
            `
        });

        return res.status(200).json({ success: true, code, shareUrl });
    } catch (error) {
        console.error('Coupon error:', error);
        return res.status(500).json({ error: 'Erro ao gerar cupom. Tente novamente.' });
    }
};
