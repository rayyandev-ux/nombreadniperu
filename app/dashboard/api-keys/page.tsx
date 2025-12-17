"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Key, Plus, Trash2, Copy, Loader2 } from "lucide-react"

export default function ApiKeysPage() {
  const [tokens, setTokens] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [generating, setGenerating] = React.useState(false)

  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/tokens')
      const data = await res.json()
      if (data.success) {
        setTokens(data.tokens)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTokens()
  }, [])

  const generateToken = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/tokens', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        fetchTokens()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  const deleteToken = async (token: string) => {
    if (!confirm('¿Estás seguro de eliminar este token?')) return

    try {
      const res = await fetch(`/api/tokens/${token}`, { method: 'DELETE' })
      if (res.ok) {
        fetchTokens()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col space-y-6 p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">API Keys</h1>
            <p className="text-zinc-400 text-sm mt-1">Administra tus llaves de acceso a la API</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                placeholder="Buscar token..."
                className="pl-9 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
            </div>
            <Button 
                onClick={generateToken} 
                disabled={generating}
                className="bg-white text-black hover:bg-zinc-200"
            >
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Generar Token
            </Button>
        </div>

        <div className="rounded-md border border-zinc-800 bg-black">
        <Table>
            <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-500">Token</TableHead>
                <TableHead className="text-zinc-500">Creado</TableHead>
                <TableHead className="text-zinc-500">Uso</TableHead>
                <TableHead className="text-zinc-500">Último uso</TableHead>
                <TableHead className="text-right text-zinc-500">Acciones</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                        Cargando tokens...
                    </TableCell>
                </TableRow>
            ) : tokens.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                        No tienes tokens activos.
                    </TableCell>
                </TableRow>
            ) : (
                tokens.map((token, i) => (
                <TableRow key={i} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell className="font-mono text-zinc-300">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <Key className="h-4 w-4 text-zinc-500" />
                        </div>
                        {token.displayToken}
                    </div>
                </TableCell>
                <TableCell className="text-zinc-400">
                    {new Date(token.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                    <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border-zinc-800">
                        {token.usage_count} requests
                    </Badge>
                </TableCell>
                <TableCell className="text-zinc-400">
                    {token.last_used ? new Date(token.last_used).toLocaleString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-900"
                            onClick={() => {
                                navigator.clipboard.writeText(token.fullToken || token.token)
                            }}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-900/50 hover:text-red-500 hover:bg-red-900/20"
                            onClick={() => deleteToken(token.token)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
                </TableRow>
            )))}
            </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
