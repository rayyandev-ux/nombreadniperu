"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Key, Server, Database } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    totalTokens: 0,
    totalRequests: 0,
    activeTokens: 0,
    cacheHits: 0 // Placeholder
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tokens')
        const data = await res.json()
        if (data.success) {
          const tokens = data.tokens
          const totalRequests = tokens.reduce((acc: number, token: any) => acc + (token.usage_count || 0), 0)
          const activeTokens = tokens.length // Assuming all returned are active
          
          setStats({
            totalTokens: tokens.length,
            totalRequests,
            activeTokens,
            cacheHits: 0 // We don't have this yet, maybe add later
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex flex-col space-y-6 p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">Resumen de actividad y estadísticas</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? "-" : stats.totalRequests}</div>
            <p className="text-xs text-zinc-500">Peticiones totales procesadas</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Tokens Activos</CardTitle>
            <Key className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? "-" : stats.activeTokens}</div>
            <p className="text-xs text-zinc-500">Llaves de API generadas</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Estado del Sistema</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Operativo</div>
            <p className="text-xs text-zinc-500">Todos los sistemas funcionando</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Cache</CardTitle>
            <Database className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Activo</div>
            <p className="text-xs text-zinc-500">Optimización habilitada</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
