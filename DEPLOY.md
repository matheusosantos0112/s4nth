# Guia de Deploy - S4NTH

## Passo 1: Criar conta no Mercado Pago

1. Acesse https://www.mercadopago.com.br
2. Crie uma conta (pessoa física ou jurídica)
3. Vá em **Seu negócio** > **Credenciais**
4. Copie o **Access Token** (produção)

## Passo 2: Criar conta no Vercel (grátis)

1. Acesse https://vercel.com
2. Clique em **Sign Up** > **Continue with GitHub** (ou crie conta com e-mail)
3. Após login, clique em **Add New...** > **Project**

## Passo 3: Subir o site no Vercel

1. **Instale o Git** (se não tiver): https://git-scm.com
2. **Instale o Node.js**: https://nodejs.org
3. Abra o terminal na pasta do projeto:
   ```
   cd C:\Users\Matheus\OneDrive\Documentos\New OpenCode Project\S4NTH
   ```
4. Inicialize o Git:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
5. Crie uma conta no GitHub: https://github.com
6. Crie um novo repositório chamado "s4nth"
7. Conecte o projeto:
   ```
   git remote add origin https://github.com/SEU-USER/s4nth.git
   git branch -M main
   git push -u origin main
   ```
8. No Vercel, importe o repositório "s4nth"
9. Na hora de deploy, adicione as variáveis de ambiente:
   - `MP_ACCESS_TOKEN` = seu token do Mercado Pago
10. Clique em **Deploy**

## Passo 4: Configurar pagamento

1. No Mercado Pago, vá em **Seu negócio** > **Checkout Pro**
2. Adicione seu site como domínio autorizado
3. Configure as notificações webhook:
   - URL: `https://seudominio.vercel.app/api/webhook`

## Passo 5: Notificar pedidos por WhatsApp (Opcional)

Para receber no WhatsApp quando alguém pedir, você pode:
1. Usar a API do WhatsApp Business
2. Ou usar um serviço como https://www.zenvia.com (gratuito)

## Passo 6: Google Search Console

1. Acesse https://search.google.com/search-console
2. Adicione sua propriedade com a URL do Vercel
3. Verifique a propriedade (meta tag ou arquivo)
4. Envie o sitemap: `https://seudominio.vercel.app/sitemap.xml`

## Estrutura de Arquivos

```
S4NTH/
├── index.html          # Página principal
├── vercel.json         # Configuração do deploy
├── .env.example        # Variáveis de ambiente
├── api/
│   ├── create-preference.js  # API Mercado Pago
│   └── webhook.js           # Webhook notificações
├── css/style.css
├── js/
│   ├── products.js
│   └── main.js
├── img/
└── pages/
```

## Variáveis de Ambiente (Vercel)

| Variável | Descrição | Onde pegar |
|----------|-----------|------------|
| `MP_ACCESS_TOKEN` | Token do Mercado Pago | MP > Credenciais |

## Comandos Úteis

```bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Variáveis de ambiente
vercel env ls
```

## Links Importantes

- **Vercel**: https://vercel.com
- **Mercado Pago**: https://www.mercadopago.com.br
- **GitHub**: https://github.com
- **Google Search Console**: https://search.google.com/search-console
