const { Resend } = require('resend');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, contactSubject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const subjectLabels = {
            'duvida': 'Dúvida sobre produto',
            'pedido': 'Acompanhar pedido',
            'troca': 'Troca / Devolução',
            'parceria': 'Parceria / Lojista',
            'outro': 'Outro'
        };

        const subjectLabel = subjectLabels[contactSubject] || contactSubject || 'Não informado';

        await resend.emails.send({
            from: 'SANTH Site <onboarding@resend.dev>',
            to: 'matheusosantos0112@gmail.com',
            replyTo: email,
            subject: `[SANTH Contato] ${subjectLabel} - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0d0d0d; border-bottom: 2px solid #0d0d0d; padding-bottom: 10px;">Nova mensagem de contato</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Nome:</td><td style="padding: 8px 0;">${name}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">E-mail:</td><td style="padding: 8px 0;">${email}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Assunto:</td><td style="padding: 8px 0;">${subjectLabel}</td></tr>
                    </table>
                    <div style="margin-top: 20px; padding: 16px; background: #f5f5f0; border-radius: 8px;">
                        <p style="font-weight: bold; color: #666; margin: 0 0 8px 0;">Mensagem:</p>
                        <p style="margin: 0; color: #333; line-height: 1.6;">${message}</p>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">Enviado via formulário do site SANTH</p>
                </div>
            `
        });

        return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Erro ao enviar mensagem. Tente novamente.' });
    }
};
