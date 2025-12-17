"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Play } from "lucide-react"

export default function PlaygroundPage() {
  const [searchType, setSearchType] = React.useState<'dni' | 'name'>('dni')
  const [searchDni, setSearchDni] = React.useState('')
  const [searchName, setSearchName] = React.useState({ nombres: '', paterno: '', materno: '' })
  const [searchResult, setSearchResult] = React.useState<any>(null)
  const [searching, setSearching] = React.useState(false)

  const handleSearch = async () => {
    setSearching(true)
    setSearchResult(null)
    
    const payload: any = {}
    if (searchType === 'dni') {
        payload.dni = searchDni
    } else {
        payload.nombres = searchName.nombres
        payload.apellido_paterno = searchName.paterno
        payload.apellido_materno = searchName.materno
    }

    try {
        const res = await fetch('/api/buscar-dni', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const data = await res.json()
        setSearchResult(data)
    } catch (error) {
        setSearchResult({ success: false, message: 'Error de conexión' })
    } finally {
        setSearching(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6 p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Playground</h1>
            <p className="text-zinc-400 text-sm mt-1">Prueba las endpoints de la API en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
              <div className="flex items-center gap-4">
                  <Button 
                    variant={searchType === 'dni' ? "default" : "outline"}
                    onClick={() => setSearchType('dni')}
                    className={searchType === 'dni' ? "bg-white text-black hover:bg-zinc-200" : "border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"}
                  >
                      Por DNI
                  </Button>
                  <Button 
                    variant={searchType === 'name' ? "default" : "outline"}
                    onClick={() => setSearchType('name')}
                    className={searchType === 'name' ? "bg-white text-black hover:bg-zinc-200" : "border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"}
                  >
                      Por Nombre
                  </Button>
              </div>

              <div className="space-y-4 p-6 border border-zinc-800 rounded-xl bg-zinc-900/20">
                  {searchType === 'dni' ? (
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-400">Número de DNI</label>
                          <Input 
                            value={searchDni}
                            onChange={(e) => setSearchDni(e.target.value)}
                            placeholder="12345678"
                            className="border-zinc-800 bg-black text-white placeholder:text-zinc-700"
                          />
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-sm font-medium text-zinc-400">Nombres</label>
                              <Input 
                                value={searchName.nombres}
                                onChange={(e) => setSearchName({...searchName, nombres: e.target.value})}
                                placeholder="JUAN CARLOS"
                                className="border-zinc-800 bg-black text-white placeholder:text-zinc-700"
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Apellido Paterno</label>
                                  <Input 
                                    value={searchName.paterno}
                                    onChange={(e) => setSearchName({...searchName, paterno: e.target.value})}
                                    placeholder="PEREZ"
                                    className="border-zinc-800 bg-black text-white placeholder:text-zinc-700"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium text-zinc-400">Apellido Materno</label>
                                  <Input 
                                    value={searchName.materno}
                                    onChange={(e) => setSearchName({...searchName, materno: e.target.value})}
                                    placeholder="LOPEZ"
                                    className="border-zinc-800 bg-black text-white placeholder:text-zinc-700"
                                  />
                              </div>
                          </div>
                      </div>
                  )}

                  <Button 
                    onClick={handleSearch}
                    disabled={searching}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                      {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Ejecutar Búsqueda
                  </Button>
              </div>
          </div>

          <div className="h-full min-h-[400px] rounded-xl border border-zinc-800 bg-black p-4 font-mono text-sm overflow-auto">
              {searchResult ? (
                  <pre className="text-zinc-300">
                      {JSON.stringify(searchResult, null, 2)}
                  </pre>
              ) : (
                  <div className="flex h-full items-center justify-center text-zinc-600">
                      Los resultados aparecerán aquí...
                  </div>
              )}
          </div>
      </div>
    </div>
  )
}
