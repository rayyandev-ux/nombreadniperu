"use client"

import * as React from "react"
import { Eye, EyeOff, UserSearch, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1) // 1: Credentials, 2: Code
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    code: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    setError("")
  }

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStep(2)
      } else {
        setError(data.message || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: formData.code })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError(data.message || "Código inválido")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 text-foreground">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
            <UserSearch className="h-6 w-6 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === 1 ? "Ingresar a raean API" : "Verificación de seguridad"}
          </h1>
          {step === 2 && (
             <p className="text-sm text-zinc-400">
               Hemos enviado un código a {formData.email}
             </p>
          )}
        </div>

        <Card className="border-zinc-800 bg-black/50 shadow-none">
          <CardHeader />
          <CardContent className="space-y-4">
            {error && (
               <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                 {error}
               </div>
            )}
            
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-400">
                    Correo
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nombre@ejemplo.com"
                    type="email"
                    className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-zinc-400">
                      Contraseña
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      className="border-zinc-800 bg-zinc-900/50 pr-10 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="code" className="text-zinc-400">
                  Código de verificación
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="123456"
                  type="text"
                  maxLength={6}
                  className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 tracking-widest text-center text-lg"
                />
              </div>
            )}
            
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800"
              onClick={step === 1 ? handleLogin : handleVerify}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {step === 1 ? "Acceder" : "Verificar"} &rarr;
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
