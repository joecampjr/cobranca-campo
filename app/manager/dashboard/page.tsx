import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ManagerDashboardPage() {
  const user = await getCurrentUser()

  if (!user || !["manager", "company_admin"].includes(user.role)) {
    redirect("/signin")
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Modo de Segurança Ativo!</strong>
        <span className="block sm:inline"> O Dashboard carregou com sucesso.</span>
        <pre className="mt-2 text-sm">{JSON.stringify({ user: user.name, role: user.role }, null, 2)}</pre>
      </div>
      <p className="mt-4">Se você está vendo isso, o erro está na busca dos dados (Banco de Dados).</p>
    </main>
  )
}
