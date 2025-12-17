import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Terminal, UserSearch } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900/50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span>dniAPI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Ingresar
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">
        <div className="relative mb-8">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
             <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-b from-zinc-800 to-black border border-zinc-800 flex items-center justify-center shadow-2xl">
                <UserSearch className="h-10 w-10 text-white" />
             </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Búsqueda de Personas Simplificada
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12">
          Una API robusta para consultar datos por DNI o Nombre Completo. 
          Integración sencilla y segura para tus aplicaciones.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
           {["Node.js", "Python", "Go", "PHP", "Java", ".NET"].map((lang) => (
             <div key={lang} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="h-12 w-12 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:border-zinc-700 group-hover:text-white transition-all">
                    <Terminal className="h-5 w-5" />
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-300">{lang}</span>
             </div>
           ))}
        </div>

        <div className="w-full max-w-3xl rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur overflow-hidden text-left shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-yellow-500">JavaScript</span>
                </div>
                <div className="h-4 w-4 text-zinc-600">
                    <Terminal className="h-3 w-3" />
                </div>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-zinc-300">
                    <code>
{`const response = await fetch('https://raean.xyz/api/buscar-dni', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    dni: '12345678'
  })
});

const data = await response.json();
console.log(data);`}
                    </code>
                </pre>
            </div>
        </div>
      </main>
    </div>
  )
}
