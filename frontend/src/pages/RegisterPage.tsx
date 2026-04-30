import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Briefcase, ChevronRight, ShieldCheck, Activity } from 'lucide-react'
import { crearUsuarioUnificado } from '../services/api'
import type { TipoUsuario } from '../types'

type Cuenta = 'PACIENTE' | 'PERSONAL_SALUD'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<Cuenta>('PACIENTE')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', contrasena: '', telefono: '',
    numDocumento: '', eps: 'Sura', grupoSanguineo: 'O+', genero: 'Masculino',
    fechaNacimiento: '',
    cargo: '', numLicencia: '', institucion: '',
  })

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const now = new Date().toISOString().slice(0, 19)
      await crearUsuarioUnificado({
        tipoUsuario: tipo as TipoUsuario,
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        contrasena: form.contrasena,
        telefono: form.telefono,
        estado: true,
        fechaCreacion: now,
        ultimoAcceso: now,
        ...(tipo === 'PACIENTE' ? {
          numDocumento: Number(form.numDocumento) || undefined,
          eps: form.eps,
          grupoSanguineo: form.grupoSanguineo,
          genero: form.genero.toUpperCase(),
          fechaNacimiento: form.fechaNacimiento ? `${form.fechaNacimiento}T00:00:00` : undefined,
        } : {
          cargo: form.cargo,
          numLicencia: Number(form.numLicencia) || undefined,
          institucion: form.institucion,
        }),
      })
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/login')
    } catch {
      toast.error('Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT – dark panel exactamente 50% */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-14 relative overflow-hidden"
           style={{ background: 'linear-gradient(155deg, #0a182e 0%, #0d2147 50%, #0a1e3d 100%)' }}>
        {/* Tech background image */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {/* Dark overlay para legibilidad del texto */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(155deg, rgba(10,24,46,0.92) 0%, rgba(13,33,71,0.85) 50%, rgba(10,30,61,0.95) 100%)' }} />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-verde-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-navy-400/10 blur-3xl pointer-events-none" />

        {/* Tech grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/logo.svg" alt="VitalCode" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <p className="font-black text-white text-xl tracking-tight">VitalCode</p>
            <p className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">HealthTech Solutions</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-verde-500/10 border border-verde-400/20 backdrop-blur-sm
                          text-verde-300 text-[11px] font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-verde-400 animate-pulse" />
            HealthTech · Tecnología Médica
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Innovación y precisión<br/>para el cuidado de la<br/>
            <span className="bg-gradient-to-r from-verde-300 to-verde-500 bg-clip-text text-transparent">vida.</span>
          </h1>
          <p className="text-white/65 text-base leading-relaxed max-w-md">
            Únete a la plataforma líder en gestión de datos de salud, diseñada para brindar
            autoridad y compostura en cada decisión clínica.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-col gap-2 max-w-md">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-verde-400" />, text: 'Cifrado AES-256 grado bancario' },
              { icon: <Activity className="w-4 h-4 text-verde-400" />,    text: 'Sincronización médica en tiempo real' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2.5 text-white/70 text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  {b.icon}
                </div>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-10 pt-6 border-t border-white/10">
          <div>
            <p className="text-3xl font-black bg-gradient-to-r from-white to-verde-200 bg-clip-text text-transparent">99.9%</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider font-bold">Precisión de Datos</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black bg-gradient-to-r from-white to-verde-200 bg-clip-text text-transparent">24/7</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider font-bold">Soporte Vital</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black bg-gradient-to-r from-white to-verde-200 bg-clip-text text-transparent">+10k</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-wider font-bold">Pacientes</p>
          </div>
        </div>
      </div>

      {/* RIGHT – form 50% */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white px-8 lg:px-14 py-10 overflow-y-auto">
        <div>
          {/* Logo móvil */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-card flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="VitalCode" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="font-black text-navy-900 tracking-tight">VitalCode</p>
              <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">HealthTech Solutions</p>
            </div>
          </div>

          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-50 border border-verde-100 text-verde-700 text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-verde-500" /> Registro Seguro
            </div>
            <h2 className="text-3xl font-black text-navy-900 mb-1 tracking-tight">
              Crea tu <span className="text-verde-600">cuenta</span>
            </h2>
            <p className="text-gray-500 text-sm">Gestión médica con autoridad y precisión profesional.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Tipo de cuenta */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-canvas rounded-xl">
                {([
                  { val: 'PACIENTE',       label: 'Paciente',          icon: <User className="w-4 h-4" /> },
                  { val: 'PERSONAL_SALUD', label: 'Personal de Salud', icon: <Briefcase className="w-4 h-4" /> },
                ] as { val: Cuenta; label: string; icon: React.ReactNode }[]).map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setTipo(t.val)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                      tipo === t.val
                        ? 'bg-white text-verde-600 shadow-sm ring-1 ring-verde-100'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Ej. Alejandro" required value={form.nombre} onChange={f('nombre')} />
              </div>
              <div>
                <label className="form-label">Apellido</label>
                <input className="form-input" placeholder="Ej. Ramírez" required value={form.apellido} onChange={f('apellido')} />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="form-label">Correo Electrónico</label>
              <input type="email" className="form-input" placeholder="usuario@vitalcode.com" required
                value={form.correo} onChange={f('correo')} />
            </div>

            {/* Contraseña + Teléfono */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-input" placeholder="••••••••" required
                  value={form.contrasena} onChange={f('contrasena')} />
              </div>
              <div>
                <label className="form-label">Teléfono</label>
                <input className="form-input" placeholder="+57 300 000 0000" required
                  value={form.telefono} onChange={f('telefono')} />
              </div>
            </div>

            {/* Información de Salud */}
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-bold text-navy-900 mb-4">Información de Salud</p>

              {tipo === 'PACIENTE' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Número de Documento</label>
                      <input className="form-input" value={form.numDocumento} onChange={f('numDocumento')} />
                    </div>
                    <div>
                      <label className="form-label">EPS</label>
                      <select className="form-input appearance-none cursor-pointer" value={form.eps} onChange={f('eps')}>
                        {['Sura', 'Sanitas', 'Compensar', 'Salud Total', 'Famisanar', 'Nueva EPS'].map((e) => (
                          <option key={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Grupo Sanguíneo</label>
                      <select className="form-input appearance-none cursor-pointer" value={form.grupoSanguineo} onChange={f('grupoSanguineo')}>
                        {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Género</label>
                      <select className="form-input appearance-none cursor-pointer" value={form.genero} onChange={f('genero')}>
                        <option>Masculino</option>
                        <option>Femenino</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Fecha Nacimiento</label>
                      <input type="date" className="form-input" value={form.fechaNacimiento} onChange={f('fechaNacimiento')} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Cargo</label>
                    <input className="form-input" placeholder="Ej. Médico Internista" required
                      value={form.cargo} onChange={f('cargo')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">N° de Licencia</label>
                      <input className="form-input" placeholder="123456" required
                        value={form.numLicencia} onChange={f('numLicencia')} />
                    </div>
                    <div>
                      <label className="form-label">Institución</label>
                      <input className="form-input" placeholder="Clínica Valle" required
                        value={form.institucion} onChange={f('institucion')} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit full width */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base mt-2"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Crear Cuenta <ChevronRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-verde-600 hover:text-verde-700 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">© 2024 VitalCode Healthcare. Precision & Authority.</p>
          <div className="flex items-center gap-4">
            {['PRIVACIDAD', 'SOPORTE'].map((l) => (
              <button key={l} className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wide">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
