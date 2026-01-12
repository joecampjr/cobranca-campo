import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, MapPin } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"

async function getTeamMembers(user: any) {
  let query = `
    SELECT id, name, email, cpf, branch, created_at 
    FROM users 
    WHERE company_id = $1 AND role = 'collector'
  `
  const params = [user.company_id]

  if (user.role === 'manager' && user.branch) {
    query += ` AND branch = $2`
    params.push(user.branch)
  }

  query += ` ORDER BY created_at DESC`

  const result = await db.query(query, params)
  return result.rows
}

export default async function TeamPage() {
  const user = await getCurrentUser()

  if (!user || !["manager", "company_admin"].includes(user.role)) {
    redirect("/signin")
  }

  const team = await getTeamMembers(user)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipe de Campo</h1>
          <p className="text-muted-foreground">Gerencie seus cobradores e suas filiais.</p>
        </div>
        <Link href="/manager/team/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {team.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum membro na equipe ainda. Adicione o primeiro!
          </Card>
        ) : (
          team.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm bg-muted inline-flex px-2 py-0.5 rounded">
                        <span className="font-mono">{member.cpf || "CPF não cadastrado"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                        <MapPin className="h-3 w-3" />
                        Filial
                      </div>
                      <div className="font-medium">{member.branch || "Matriz"}</div>
                    </div>
                    {/* Future: Edit/Delete buttons */}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
