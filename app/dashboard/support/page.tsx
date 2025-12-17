"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="flex flex-col space-y-6 p-8 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Soporte</h1>
        <p className="text-zinc-400 text-sm mt-1">¿Necesitas ayuda? Contáctanos.</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Contacto Directo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300 mb-4">
            Para cualquier consulta, reporte de error o solicitud de características, por favor escríbenos a nuestro correo oficial:
          </p>
          <div className="p-4 bg-black rounded-lg border border-zinc-800 inline-block">
            <a href="mailto:flexistired@gmail.com" className="text-lg font-mono text-green-400 hover:underline">
              flexistired@gmail.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
