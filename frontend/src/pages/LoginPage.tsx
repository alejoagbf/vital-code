import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Activity, ArrowRight } from 'lucide-react'
// import { login } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', contraseña: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.correo || !form.contraseña) {
      toast.error('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    // ── MOCK ──────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 900))
    localStorage.setItem('vitalcode_token', 'TOKEN_DE_PRUEBA')
    toast.success('¡Bienvenido a VitalCode!')
    navigate('/pacientes')
    setLoading(false)
    // ── CON BACKEND ───────────────────────────────────────────────────────────
    // try {
    //   await login(form)
    //   toast.success('¡Bienvenido a VitalCode!')
    //   navigate('/pacientes')
    // } catch {
    //   toast.error('Credenciales incorrectas. Intenta de nuevo.')
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo – Branding ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-header flex-col items-center justify-center p-14 relative overflow-hidden">

        {/* Decoración – orbs animados */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-accent-500/10 animate-float-slow" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[350px] h-[350px] rounded-full bg-white/5 animate-float" />
        <div className="absolute top-1/2 left-1/4 w-[180px] h-[180px] rounded-full bg-accent-500/8" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 text-center max-w-sm animate-fade-in">

          {/* Logo */}
          <div className="mx-auto mb-7 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm
                          border border-white/20 flex items-center justify-center shadow-glow-cyan">
            <img src="/logo.png" alt="VitalCode"
              className="w-16 h-16 object-contain drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.removeAttribute('style')
              }}
            />
            <Activity className="w-12 h-12 text-accent-400 hidden" style={{ display: 'none' }} />
          </div>

          <h1 className="text-5xl font-black text-white mb-1 tracking-tight">VitalCode</h1>
          <p className="text-accent-400 font-semibold text-lg mb-4 tracking-wide">HealthTech S.A.S.</p>
          <div className="w-16 h-0.5 bg-accent-500/60 mx-auto mb-6 rounded-full" />
          <p className="text-white/55 text-sm leading-relaxed">
            Sistema integral de gestión médica. Conectando pacientes, personal de salud
            y administradores en una sola plataforma segura.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { label: 'Pacientes', value: '1.2K+', icon: '👥' },
              { label: 'Personal', value: '80+',   icon: '🩺' },
              { label: 'Citas/mes', value: '3.4K',  icon: '📅' },
            ].map((s) => (
              <div key={s.label}
                className="bg-white/8 backdrop-blur-sm rounded-2xl p-4
                           border border-white/10 hover:bg-white/12 transition-colors">
                <p className="text-lg mb-0.5">{s.icon}</p>
                <p className="text-white font-black text-xl">{s.value}</p>
                <p className="text-white/45 text-xs mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Certification badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-white/8 border border-white/15 text-xs text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma certificada · Datos cifrados SSL
          </div>
        </div>
      </div>

      {/* ── Panel derecho – Formulario ──────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-slide-up">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-btn flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-primary-800">VitalCode</span>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600" />

            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Iniciar sesión</h2>
              <p className="text-sm text-gray-500 mb-8">
                Ingresa tus credenciales para acceder al sistema
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Correo */}
                <div>
                  <label className="form-label">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="correo@healthtech.com"
                      className="form-input pl-10"
                      value={form.correo}
                      onChange={(e) => setForm({ ...form, correo: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="form-label">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="form-input pl-10 pr-11"
                      value={form.contraseña}
                      onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400
                                 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      {showPwd
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center py-3 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verificando…
                    </>
                  ) : (
                    <>
                      Ingresar al sistema
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            HealthTech S.A.S. © {new Date().getFullYear()} · VitalCode v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
