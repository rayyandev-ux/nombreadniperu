"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
  return (
    <div className="flex flex-col space-y-6 p-8 text-white max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Documentación</h1>
        <p className="text-zinc-400 text-sm mt-1">Guía de integración y uso de la API</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Autenticación</h2>
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="pt-6">
                    <p className="text-zinc-300 mb-4">
                        Todas las peticiones a la API deben incluir el header <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200">Authorization</code> con tu token Bearer.
                    </p>
                    <pre className="bg-black p-4 rounded-lg border border-zinc-800 text-sm text-zinc-400 overflow-x-auto">
{`Authorization: Bearer sk_live_...`}
                    </pre>
                </CardContent>
            </Card>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Endpoints</h2>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white font-mono text-base">POST /api/buscar-dni</CardTitle>
                        <Badge variant="outline" className="text-green-400 border-green-900 bg-green-900/20">POST</Badge>
                    </div>
                    <CardDescription>Busca información de personas por DNI o Nombre Completo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Body Parameters</h4>
                        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                            <li><code className="text-white">dni</code> (opcional): Número de DNI (8 dígitos).</li>
                            <li><code className="text-white">nombres</code> (opcional): Nombres de la persona.</li>
                            <li><code className="text-white">apellido_paterno</code> (opcional): Apellido paterno.</li>
                            <li><code className="text-white">apellido_materno</code> (opcional): Apellido materno.</li>
                        </ul>
                        <p className="text-xs text-zinc-500 mt-2 italic">* Debes enviar DNI o (Nombres + Apellidos).</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Ejemplo de Uso (DNI)</h4>
                        <pre className="bg-black p-4 rounded-lg border border-zinc-800 text-sm text-zinc-400 overflow-x-auto">
{`curl -X POST https://raean.xyz/api/buscar-dni \\
  -H "Authorization: Bearer TU_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "dni": "72198212" }'`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Sistema de Caché Inteligente</h2>
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="pt-6">
                    <p className="text-zinc-300">
                        Nuestra API implementa un sistema de caché bidireccional avanzado. 
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-400 mt-4 space-y-2">
                        <li>
                            Si buscas por <strong>DNI</strong>, guardamos automáticamente la relación con el nombre. 
                            Futuras búsquedas por ese nombre serán instantáneas y no consumirán saldo de proveedores externos.
                        </li>
                        <li>
                            Si buscas por <strong>Nombre</strong>, el sistema verifica primero si el DNI asociado ya está en caché.
                            Si es así, devuelve los datos inmediatamente sin realizar consultas externas adicionales.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </section>
      </div>
    </div>
  )
}
