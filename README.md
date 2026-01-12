# Cobrança em Campo - SaaS de Gestão de Cobranças

Sistema completo de gestão de cobranças em campo com rotas otimizadas, app mobile (PWA) e integração com Asaas para pagamentos digitais.

## Funcionalidades

### Multi-tenancy & RBAC
- Suporte para múltiplas empresas
- 5 níveis de acesso: Super Admin, Company Admin, Manager, Collector, Customer
- Controle granular de permissões

### Dashboards
- **Admin**: Gestão completa da empresa, clientes e cobranças
- **Manager**: Gerenciamento de equipe e rotas
- **Collector**: App mobile para cobrança em campo
- **Customer**: Portal para visualizar e pagar cobranças

### Recursos Principais
- Rotas otimizadas com GPS
- Rastreamento em tempo real de cobradores
- Gestão de comissões
- Múltiplos métodos de pagamento (PIX, Boleto, Cartão)
- Notificações e alertas
- Relatórios e analytics
- PWA para uso offline

## Tecnologias

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon ou Supabase)
- **Authentication**: Custom with bcrypt
- **Payments**: Asaas API
- **Mobile**: PWA

## Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Database

Você precisará de um banco PostgreSQL. Recomendamos:
- [Neon](https://neon.tech) - Serverless Postgres
- [Supabase](https://supabase.com) - Postgres com recursos extras

Após criar seu banco, execute os scripts SQL em ordem:

```bash
# Execute via seu cliente de database preferido
scripts/01-create-tables.sql
```

### 3. Variáveis de Ambiente

Configure as seguintes variáveis (use a seção Vars no v0 ou crie um arquivo `.env.local`):

```env
# Database (exemplo para Neon)
DATABASE_URL=postgresql://user:password@host/database

# Asaas Payment Gateway
ASAAS_API_KEY=your_api_key_here
ASAAS_ENVIRONMENT=sandbox # ou 'production'

# Para desenvolvimento local com Supabase auth redirect
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Configurar Webhooks da Asaas

1. Acesse [Asaas Dashboard](https://www.asaas.com)
2. Vá em Configurações > Webhooks
3. Adicione: `https://seu-dominio.com/api/webhooks/asaas`
4. Ative os eventos: PAYMENT_CREATED, PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_REFUNDED

Veja `docs/ASAAS_SETUP.md` para instruções detalhadas.

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura do Projeto

```
app/
├── (auth)/
│   ├── signin/          # Login
│   └── signup/          # Cadastro
├── admin/               # Dashboard Admin
│   ├── dashboard/
│   ├── customers/
│   ├── collectors/
│   └── charges/
├── manager/             # Dashboard Manager
│   ├── dashboard/
│   ├── routes/
│   └── team/
├── collector/           # App Mobile (PWA)
│   ├── route/
│   ├── customer/
│   └── history/
├── customer/            # Portal do Cliente
│   ├── portal/
│   └── pay/
├── api/
│   ├── auth/           # Authentication endpoints
│   ├── payments/       # Payment operations
│   └── webhooks/       # Asaas webhooks
lib/
├── auth.ts             # Authentication utilities
├── db.ts               # Database client
└── asaas.ts            # Asaas API client
scripts/
└── 01-create-tables.sql  # Database schema
```

## Usuários de Exemplo

Após criar o banco, você pode criar usuários via signup ou diretamente no banco:

```sql
-- Super Admin (desenvolvimento)
INSERT INTO users (name, email, password_hash, role, status) 
VALUES ('Admin', 'admin@example.com', '$2a$10$...', 'super_admin', 'active');
```

## Deploy

### Vercel (Recomendado)

1. Clique em "Publish" no v0
2. Configure as variáveis de ambiente no Vercel
3. Conecte seu banco de dados
4. Deploy automático

### Outros Provedores

O projeto é um Next.js padrão e pode ser hospedado em:
- Vercel
- Netlify
- Railway
- Render
- AWS/GCP/Azure

## Roadmap

- [ ] Importação em massa de clientes (CSV)
- [ ] Integração com WhatsApp para notificações
- [ ] Relatórios avançados com gráficos
- [ ] Otimização de rotas com algoritmo avançado
- [ ] Modo offline completo para o app mobile
- [ ] Integração com outras gateways de pagamento
- [ ] Multi-idioma (EN, ES)

## Suporte

Para dúvidas e suporte:
- Documentação Asaas: https://docs.asaas.com
- Issues no GitHub
- Email: suporte@example.com

## Licença

Proprietary - Todos os direitos reservados
