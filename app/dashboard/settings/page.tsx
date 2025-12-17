"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [settings, setSettings] = React.useState({
    factiliza_token: '',
    dniperu_token: '',
    dniperu_security: '',
    dniperu_cc_token: '',
    dniperu_cc_sig: ''
  })

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        alert('Configuración guardada correctamente')
      } else {
        alert('Error al guardar la configuración')
      }
    } catch (error) {
      console.error(error)
      alert('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6 p-8 text-white max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-zinc-400 text-sm mt-1">Administra tus llaves de API externas</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Proveedores de Datos</CardTitle>
          <CardDescription className="text-zinc-400">
            Configura tus propias llaves para Factiliza y DniPeru. Si las dejas vacías, se usarán las del sistema (si están disponibles).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-300">Factiliza Token</Label>
            <Input 
              value={settings.factiliza_token}
              onChange={(e) => setSettings({ ...settings, factiliza_token: e.target.value })}
              placeholder="Token de Factiliza"
              className="bg-black border-zinc-800 text-white placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <Label className="text-zinc-300 text-lg font-semibold block">DniPeru Configuration</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase">Security Code</Label>
                    <Input 
                    value={settings.dniperu_security}
                    onChange={(e) => setSettings({ ...settings, dniperu_security: e.target.value })}
                    placeholder="Ej: 37ea666f56"
                    className="bg-black border-zinc-800 text-white placeholder:text-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase">CC Token</Label>
                    <Input 
                    value={settings.dniperu_cc_token}
                    onChange={(e) => setSettings({ ...settings, dniperu_cc_token: e.target.value })}
                    placeholder="Ej: f7ce510e99..."
                    className="bg-black border-zinc-800 text-white placeholder:text-zinc-700"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-400 text-xs uppercase">CC Signature</Label>
                    <Input 
                    value={settings.dniperu_cc_sig}
                    onChange={(e) => setSettings({ ...settings, dniperu_cc_sig: e.target.value })}
                    placeholder="Ej: 761d4f9306..."
                    className="bg-black border-zinc-800 text-white placeholder:text-zinc-700"
                    />
                </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-medium"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
