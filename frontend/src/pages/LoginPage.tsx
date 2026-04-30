import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, LogIn, Headphones } from 'lucide-react'
import { login as loginApi } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.correo || !form.contrasena) {
      toast.error('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      const user = await loginApi(form.correo, form.contrasena)
      toast.success(`¡Bienvenido, ${user.nombre}!`)
      navigate('/dashboard')
    } catch {
      toast.error('Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4 py-12 relative">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">

        {/* Logo area */}
        <div className="flex flex-col items-center pt-10 pb-6 px-10 relative">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-verde-50/80 to-transparent pointer-events-none" />
          <div className="relative w-28 h-28 mb-2">
            <div className="absolute inset-0 bg-verde-100/60 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-white rounded-3xl shadow-card flex items-center justify-center">
              <img src="/logo.svg" alt="VitalCode" className="w-20 h-20 object-contain" />
            </div>
          </div>
          <p className="mt-3 text-xl font-black text-navy-900 tracking-tight">
            Vital<span className="text-verde-600">Code</span>
          </p>
          <p className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mt-1">HealthTech Solutions</p>
        </div>

        {/* Form */}
        <div className="px-10 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-navy-900">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="ejemplo@vitalcode.com"
                  className="form-input pl-10"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-navy-900">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input pl-10 pr-11"
                  value={form.contrasena}
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm font-semibold text-verde-600 hover:text-verde-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Entrar <LogIn className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="my-5 border-t border-gray-100" />

          <p className="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-bold text-verde-600 hover:text-verde-700 transition-colors">
              Regístrate ahora
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white">
          <span className="w-2 h-2 rounded-full bg-verde-500" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Sistema Operativo · V.2.4.0
          </span>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-1">
          © 2024 VitalCode Healthcare Digital. Todos los derechos reservados.<br />
          Acceso restringido a personal autorizado.
        </p>
      </div>

      {/* Support bubble */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center shadow-lg hover:bg-navy-800 transition-colors">
        <Headphones className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}
