import { Link } from 'react-router-dom'
import {
  ShieldCheck, Zap, Cloud, QrCode, UserPlus, FileText, LogIn, Check,
  Sparkles, ArrowRight,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-navy-900">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white shadow-card border border-gray-100 flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="VitalCode" className="w-8 h-8 object-contain" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-navy-900 text-base">Vital<span className="text-verde-600">Code</span></span>
              <span className="text-[9px] text-gray-400 block uppercase tracking-widest font-bold">Un producto de HealthTech</span>
            </div>
          </a>

          {/* Anchor links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#como-funciona" className="hover:text-navy-900 transition-colors">Cómo funciona</a>
            <a href="#beneficios"    className="hover:text-navy-900 transition-colors">Beneficios</a>
            <a href="#seguridad"     className="hover:text-navy-900 transition-colors">Seguridad</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-navy-900 transition-colors">
              <LogIn className="w-4 h-4" /> Acceso
            </Link>
            <Link to="/register" className="btn-primary">
              <UserPlus className="w-4 h-4" /> Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <div id="top" />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-8 bg-canvas">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-verde-50 border border-verde-100 text-verde-700 text-xs font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-verde-500" />
              Tecnología Médica de Vanguardia
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-navy-900 leading-[1.05] mb-6 tracking-tight">
              Información que{' '}
              <span className="text-verde-500">salva vidas</span>
              , a un click.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
              La plataforma líder en gestión de información médica de emergencia mediante
              códigos QR dinámicos. Tu historial, siempre contigo y bajo el respaldo de
              HealthTech S.A.S.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/register" className="btn-primary px-6 py-3.5">
                <UserPlus className="w-4 h-4" /> Registrarse
              </Link>
              <Link to="/login" className="btn-dark px-6 py-3.5">
                <ShieldCheck className="w-4 h-4" /> Ingresa al Sistema
              </Link>
            </div>
          </div>

          {/* Hero image + floating badges */}
          <div className="relative hidden lg:block">
            {/* Decorative blurred glow behind image */}
            <div className="absolute -inset-6 bg-gradient-to-br from-verde-300/30 to-navy-500/20 rounded-[2.5rem] blur-2xl pointer-events-none" />

            <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-soft
                            ring-1 ring-black/5 bg-gradient-to-br from-navy-100 to-navy-200">
              <img
                src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=900&auto=format&fit=crop&q=80"
                alt="Equipo médico revisando información clínica"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback: si la primera no carga, intenta con otra
                  const img = e.currentTarget
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = '1'
                    img.src = 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=900&auto=format&fit=crop&q=80'
                  } else {
                    img.style.display = 'none'
                  }
                }}
              />
              {/* Subtle dark gradient para integrar la imagen con la página */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating badge — bottom: Respuesta Inmediata */}
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-soft border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-verde-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-verde-600" />
              </div>
              <div>
                <p className="text-sm font-black text-navy-900">Respuesta Inmediata</p>
                <p className="text-[11px] text-gray-500">Acceso en menos de 5s</p>
              </div>
            </div>

            {/* Floating badge — top right: Datos seguros */}
            <div className="absolute -top-4 -right-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-navy-900 shadow-soft">
              <div className="w-9 h-9 rounded-xl bg-verde-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-verde-300" />
              </div>
              <div>
                <p className="text-xs font-black text-white">Datos Encriptados</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">AES-256 · HIPAA</p>
              </div>
            </div>

            {/* Floating mini-card: estadística viva */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 hidden xl:flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white shadow-soft border border-gray-100">
              <p className="text-2xl font-black text-verde-600 leading-none">+10k</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Pacientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROTOCOLO DE ACTIVACIÓN ── */}
      <section id="como-funciona" className="relative py-28 px-8 overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #06101f 0%, #0a182e 50%, #0d1f3c 100%)' }}>
        {/* Decorative blurred orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-verde-500/10 blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-[28rem] h-[28rem] rounded-full bg-navy-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-verde-400/5 blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
            Protocolo de <span className="bg-gradient-to-r from-verde-300 to-verde-500 bg-clip-text text-transparent">Activación Vital</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Tres pasos simples que transforman la seguridad de tu salud personal y familiar.
            Diseñado para ser rápido, seguro y a prueba de emergencias.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Registro Seguro',  icon: <UserPlus className="w-7 h-7 text-white" />,
              desc: 'Crea tu perfil encriptado. Cumplimos los estándares internacionales de protección de datos médicos.',
              tag: 'AES-256' },
            { num: '02', title: 'Historial Dinámico', icon: <FileText className="w-7 h-7 text-white" />,
              desc: 'Carga alergias, medicación y contactos. Actualiza tu información en tiempo real sin cambiar de código.',
              tag: 'Tiempo Real' },
            { num: '03', title: 'Portabilidad Total', icon: <QrCode className="w-7 h-7 text-white" />,
              desc: 'Genera tu QR único para brazaletes, tarjetas o digital. Acceso inmediato para paramédicos y doctores.',
              tag: 'Acceso 24/7' },
          ].map((s, i) => (
            <div key={s.num}
                 className="group relative rounded-3xl p-8 border border-white/10
                            bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm
                            hover:border-verde-400/40 transition-all duration-500
                            hover:-translate-y-2 hover:shadow-glow-green overflow-hidden">
              {/* Hover gradient glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: 'radial-gradient(circle at top right, rgba(16,185,129,0.15), transparent 60%)' }} />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-glow-green
                                bg-gradient-to-br from-verde-400 to-verde-600">
                  {s.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-verde-400 tracking-widest">PASO {s.num}</span>
                  <span className="px-2 py-0.5 rounded-full bg-verde-500/15 border border-verde-500/30 text-[9px] font-bold text-verde-300 uppercase tracking-wider">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>

                {/* Connector arrow (between cards on desktop) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10
                                   w-6 h-6 rounded-full bg-navy-900 border border-verde-500/30
                                   items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-verde-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section id="beneficios" className="py-24 px-8 bg-canvas">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-black text-navy-900 mb-2 tracking-tight">Beneficios de Clase Mundial</h2>
              <p className="text-gray-500 text-base max-w-xl">Diseñado por expertos en salud y tecnología para garantizar precisión absoluta.</p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-navy-700">
              <Check className="w-3.5 h-3.5 text-verde-500" />
              Avalado por Instituciones Médicas
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Dark card 7 cols */}
            <div className="lg:col-span-7 rounded-3xl min-h-[380px] relative overflow-hidden grid md:grid-cols-2"
                 style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d1f3c 100%)' }}>
              <div className="p-10 flex flex-col justify-between relative z-10">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-verde-500 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                    Para Pacientes
                  </span>
                  <h3 className="text-3xl font-black text-white mb-6 leading-tight">
                    La voz de tu salud cuando tú no puedes hablar.
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Alertas automáticas a familiares en caso de escaneo.',
                      'Privacidad total con controles de acceso por tiempo.',
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-verde-400 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative min-h-[260px] md:min-h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&auto=format&fit=crop&q=80"
                  alt="Paciente recibiendo atención médica de emergencia"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a182e] via-[#0a182e]/40 to-transparent md:via-transparent md:from-[#0a182e]/80" />
                <div className="absolute bottom-5 right-5 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-sm shadow-soft">
                  <div className="w-8 h-8 rounded-lg bg-verde-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-verde-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-navy-900 leading-tight">Atención Crítica</p>
                    <p className="text-[10px] text-gray-500 leading-tight">QR escaneable 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right cards 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {[
                { icon: <Zap className="w-6 h-6 text-verde-600" />,   title: 'Velocidad Vital',
                  desc: 'Acceso a datos críticos en menos de 5 segundos en cualquier lugar del mundo.' },
                { icon: <Cloud className="w-6 h-6 text-verde-600" />, title: 'Nube Segura',
                  desc: 'Sincronización instantánea en todos tus dispositivos y códigos impresos.' },
              ].map((b) => (
                <div key={b.title} className="flex-1 bg-white rounded-3xl p-7 border border-gray-100 shadow-card flex flex-col items-center text-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-verde-50 flex items-center justify-center mb-4">
                    {b.icon}
                  </div>
                  <p className="font-black text-navy-900 text-lg mb-2">{b.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPALDO CORPORATIVO (SEGURIDAD) ── */}
      <section id="seguridad" className="py-24 px-8" style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d1f3c 100%)' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 overflow-hidden shadow-lg">
              <img src="/logo.svg" alt="VitalCode" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-4xl font-black text-white mb-5 tracking-tight leading-tight">
              Respaldo Corporativo<br/>de Elite
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
              VitalCode es una solución tecnológica desarrollada y soportada por{' '}
              <span className="text-white font-bold">HealthTech S.A.S.</span>, empresa líder en
              innovación de salud digital. Nuestra infraestructura cumple con los protocolos de
              seguridad de grado bancario y normativas internacionales HIPAA.
            </p>
            <div className="flex items-center gap-12">
              <div>
                <p className="text-3xl font-black text-verde-400">99.9%</p>
                <p className="text-gray-500 text-[11px] mt-1 uppercase tracking-widest">Disponibilidad</p>
              </div>
              <div>
                <p className="text-3xl font-black text-verde-400">AES-256</p>
                <p className="text-gray-500 text-[11px] mt-1 uppercase tracking-widest">Encriptación</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-verde-400" />, title: 'Legalidad y Ética',
                desc: 'Cumplimiento estricto de la Ley 1581 de protección de datos personales.' },
              { icon: <Zap className="w-5 h-5 text-verde-400" />,         title: 'Soporte 24/7',
                desc: 'Un equipo de ingenieros y especialistas médicos monitoreando el sistema.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-6 rounded-2xl bg-navy-800/60 border border-navy-700">
                <div className="w-10 h-10 rounded-xl bg-verde-500/15 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-white mb-1">{f.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {[0,1,2].map((i) => (
              <div key={i} className={`rounded-full ${i === 1 ? 'bg-verde-500 w-12 h-3' : 'bg-verde-200 w-3 h-3'}`} />
            ))}
            <span className="ml-2 text-xs font-bold text-verde-600">+10k</span>
          </div>
          <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">
            Únete a la red de protección<br/>médica más avanzada
          </h2>
          <p className="text-gray-500 mb-10 text-base">
            No dejes tu vida al azar. Comienza tu perfil hoy mismo bajo el respaldo tecnológico de HealthTech.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary px-8 py-4">
              <Sparkles className="w-4 h-4" /> Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="text-gray-400 px-8 py-14" style={{ background: '#0a182e' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                <img src="/logo.svg" alt="VitalCode" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="font-black text-white text-base leading-none">Vital<span className="text-verde-400">Code</span></p>
                <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Un producto de HealthTech S.A.S.</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
              Innovación disruptiva para la atención de emergencias. Tecnología humana para un mundo conectado.
            </p>
          </div>

          {[
            { title: 'Soluciones', links: ['Para Personas', 'Para Hospitales', 'Para Aseguradoras', 'Kits de Emergencia'] },
            { title: 'Compañía',   links: ['Sobre HealthTech', 'Privacidad de Datos', 'Términos Legales', 'Prensa'] },
            { title: 'Sede Central', links: ['Medellín, Colombia', 'Centro de Innovación HealthTech', 'contacto@healthtech.com.co'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-verde-400" /> {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-700/60 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-500">© 2024 VitalCode by HealthTech S.A.S. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {['ISO 27001 CERTIFIED', 'GDPR COMPLIANT'].map((b) => (
              <span key={b} className="text-[10px] font-bold text-gray-500 tracking-wider">{b}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
