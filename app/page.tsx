import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, Users, MapPin, Smartphone, BarChart3, Shield, Zap, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Cobrança em Campo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Planos
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Começar Grátis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            <span>Sistema completo de gestão de cobranças</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Gerencie cobranças em campo com <span className="text-primary">eficiência e segurança</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Plataforma completa para empresas que realizam cobranças porta a porta. Otimize rotas, acompanhe cobradores
            em tempo real e receba pagamentos digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Ver Demonstração
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Teste grátis por 14 dias. Não é necessário cartão de crédito.
          </p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
            <img src="/modern-dashboard-interface-with-maps-and-analytics.jpg" alt="Dashboard Preview" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo que você precisa para cobranças em campo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais para otimizar seu processo de cobrança e aumentar sua taxa de recuperação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rotas Otimizadas</h3>
              <p className="text-muted-foreground">
                Algoritmo inteligente que calcula a melhor rota para seus cobradores, economizando tempo e combustível
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">App Mobile (PWA)</h3>
              <p className="text-muted-foreground">
                Aplicativo para cobradores funcionando offline com sincronização automática quando online
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Completo</h3>
              <p className="text-muted-foreground">
                Acompanhe métricas em tempo real: cobranças realizadas, valores recebidos e desempenho da equipe
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamentos Digitais</h3>
              <p className="text-muted-foreground">
                Integração com Asaas para PIX, boleto e cartão. Receba pagamentos na hora com segurança
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Equipe</h3>
              <p className="text-muted-foreground">
                Gerencie múltiplos cobradores, defina metas, calcule comissões e acompanhe performance individual
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rastreamento em Tempo Real</h3>
              <p className="text-muted-foreground">
                Veja a localização dos cobradores em tempo real e acompanhe o progresso das rotas durante o dia
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-lg text-muted-foreground">Simples e eficiente em 4 passos</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cadastre seus clientes</h3>
                <p className="text-muted-foreground">
                  Importe ou cadastre manualmente seus clientes devedores com endereços completos
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Crie as rotas de cobrança</h3>
                <p className="text-muted-foreground">
                  O sistema otimiza automaticamente a rota para economizar tempo e deslocamento
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cobradores vão a campo</h3>
                <p className="text-muted-foreground">
                  App mobile guia os cobradores com GPS e permite registrar pagamentos na hora
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Acompanhe os resultados</h3>
                <p className="text-muted-foreground">
                  Dashboard em tempo real mostra cobranças realizadas, valores recebidos e performance da equipe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos para todos os tamanhos</h2>
            <p className="text-lg text-muted-foreground">Escolha o plano ideal para o tamanho da sua operação</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 97</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Até 3 cobradores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>500 clientes cadastrados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Rotas otimizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>App mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suporte por email</span>
                </li>
              </ul>
              <Link href="/signup?plan=basic">
                <Button className="w-full bg-transparent" variant="outline">
                  Começar Agora
                </Button>
              </Link>
            </Card>

            {/* Professional Plan */}
            <Card className="p-8 border-primary shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Profissional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 247</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Até 10 cobradores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Clientes ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Pagamentos digitais (PIX/Boleto)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Gestão de comissões</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Link href="/signup?plan=professional">
                <Button className="w-full">Começar Agora</Button>
              </Link>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 497</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Cobradores ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Multi-empresa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>API personalizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Integrações customizadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Treinamento da equipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Gerente de conta dedicado</span>
                </li>
              </ul>
              <Link href="/contact?plan=enterprise">
                <Button className="w-full bg-transparent" variant="outline">
                  Falar com Vendas
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para revolucionar suas cobranças?</h2>
          <p className="text-lg mb-8 opacity-90">
            Comece gratuitamente hoje e veja como o Cobrança em Campo pode aumentar sua taxa de recuperação
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="font-semibold">
              Começar Teste Grátis de 14 Dias
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Cobrança em Campo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Gestão inteligente de cobranças em campo para empresas de todos os tamanhos
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demonstração
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Cobrança em Campo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
