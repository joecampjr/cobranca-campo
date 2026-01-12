import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminHeader } from "@/components/admin/admin-header"
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default async function CustomersPage() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "company_admin" && user.role !== "super_admin")) {
    redirect("/signin")
  }

  // Mock data
  const customers = [
    {
      id: "1",
      name: "João Silva",
      document: "123.456.789-00",
      email: "joao@email.com",
      phone: "(11) 98765-4321",
      address: "Rua das Flores, 123 - São Paulo, SP",
      status: "active",
      totalDebt: 1250.0,
    },
    {
      id: "2",
      name: "Maria Santos",
      document: "987.654.321-00",
      email: "maria@email.com",
      phone: "(11) 91234-5678",
      address: "Av. Paulista, 456 - São Paulo, SP",
      status: "active",
      totalDebt: 890.5,
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      document: "456.789.123-00",
      email: "carlos@email.com",
      phone: "(11) 99876-5432",
      address: "Rua Augusta, 789 - São Paulo, SP",
      status: "inactive",
      totalDebt: 0,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clientes</h1>
            <p className="text-muted-foreground">Gerencie seus clientes e devedores</p>
          </div>
          <Link href="/admin/customers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-10" />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">{customer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.document}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{customer.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Débito Total</p>
                    <p className="text-xl font-bold">
                      R$ {customer.totalDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link href={`/admin/customers/${customer.id}`}>
                    <Button variant="outline">Ver Detalhes</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
