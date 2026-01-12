# Configuração da Integração Asaas

## Pré-requisitos

1. Conta Asaas (Sandbox ou Produção)
2. API Key da Asaas

## Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env`:

```env
ASAAS_API_KEY=your_asaas_api_key_here
ASAAS_ENVIRONMENT=sandbox # ou 'production'
```

## Configuração de Webhooks

1. Acesse o painel Asaas: https://www.asaas.com
2. Vá em Configurações > Webhooks
3. Adicione a URL do webhook: `https://your-domain.com/api/webhooks/asaas`
4. Selecione os eventos:
   - PAYMENT_CREATED
   - PAYMENT_CONFIRMED
   - PAYMENT_RECEIVED
   - PAYMENT_OVERDUE
   - PAYMENT_REFUNDED
   - PAYMENT_DELETED

## Eventos Suportados

### PAYMENT_CONFIRMED / PAYMENT_RECEIVED
- Atualiza status da cobrança para "received"
- Registra data e valor do pagamento
- Calcula comissão do cobrador
- Envia notificações

### PAYMENT_OVERDUE
- Atualiza status para "overdue"
- Envia alertas para gestores

### PAYMENT_REFUNDED
- Atualiza status para "cancelled"
- Registra estorno

### PAYMENT_DELETED
- Cancela cobrança local

## Fluxo de Pagamento

### 1. Criar Cobrança
```typescript
POST /api/payments/create
{
  "chargeId": "uuid",
  "billingType": "PIX", // or "BOLETO", "CREDIT_CARD"
  "installments": 1
}
```

### 2. Processar Cartão de Crédito
```typescript
POST /api/payments/credit-card
{
  "paymentId": "asaas_payment_id",
  "creditCard": {
    "holderName": "Nome no Cartão",
    "number": "1234567890123456",
    "expiryMonth": "12",
    "expiryYear": "2026",
    "ccv": "123"
  },
  "holderInfo": {
    "name": "Nome Completo",
    "email": "email@example.com",
    "cpfCnpj": "12345678900",
    "postalCode": "12345-678",
    "addressNumber": "123",
    "phone": "11987654321"
  }
}
```

### 3. Verificar Status
```typescript
GET /api/payments/status/{chargeId}
```

## Testes no Sandbox

Para testar pagamentos no ambiente sandbox da Asaas:

### PIX
- O pagamento será confirmado automaticamente após alguns segundos

### Boleto
- Use o código de barras gerado para simular pagamento no painel Asaas

### Cartão de Crédito
Cartões de teste:
- Aprovado: 5162306219378829
- Recusado: 5448280000000007

## Segurança

1. Nunca exponha a API Key no frontend
2. Valide webhooks usando a assinatura
3. Use HTTPS em produção
4. Implemente rate limiting
5. Monitore logs de webhooks

## Suporte

Documentação oficial: https://docs.asaas.com
