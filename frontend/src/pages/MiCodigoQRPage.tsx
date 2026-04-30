import DashboardLayout from '../components/layout/DashboardLayout'
import { ShieldCheck, Download, AlertTriangle, Utensils, Clock, Calendar, Lock, Droplet } from 'lucide-react'

function QRPlaceholder() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" fill="#0a182e" rx="14" />
      {/* Random QR pattern */}
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => {
          const isCorner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3)
          const rand = ((row * 7 + col) * 37 + row + col) % 3
          const filled = isCorner || rand === 0
          return filled ? (
            <rect
              key={`${row}-${col}`}
              x={18 + col * 16}
              y={18 + row * 16}
              width="13"
              height="13"
              fill="white"
              rx="1.5"
            />
          ) : null
        })
      )}
      {/* Corner positioning squares */}
      <rect x="14" y="14" width="44" height="44" fill="none" stroke="white" strokeWidth="4" rx="3" />
      <rect x="122" y="14" width="44" height="44" fill="none" stroke="white" strokeWidth="4" rx="3" />
      <rect x="14" y="122" width="44" height="44" fill="none" stroke="white" strokeWidth="4" rx="3" />
    </svg>
  )
}

const alergias = [
  {
    nombre: 'Penicilina', reaccion: 'ANAFILAXIA', nivel: 'SEVERA',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    iconBg: 'bg-red-50',
    nivelCls: 'bg-red-600 text-white',
  },
  {
    nombre: 'Mariscos', reaccion: 'URTICARIA', nivel: 'MODERADA',
    icon: <Utensils className="w-5 h-5 text-gray-500" />,
    iconBg: 'bg-gray-100',
    nivelCls: 'bg-gray-200 text-gray-700',
  },
]

const medicamentos = [
  { nombre: 'Metformina 850mg', frecuencia: 'Mañana / Noche', proxima: '20:00', diasRestantes: 12, destacado: true },
  { nombre: 'Losartán 50mg',    frecuencia: 'Cada 24h',       proxima: 'Mañana 08:00', diasRestantes: null, destacado: false },
]

export default function MiCodigoQRPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black text-navy-900">Mi Identificación Médica</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona tu código de emergencia y revisa tu información vital.</p>
          </div>
          <button className="btn-primary px-5 py-3 shadow-md">
            <Download className="w-4 h-4" />
            Descargar Carnet PDF
          </button>
        </div>

        {/* Main grid: QR card + side cards */}
        <div className="grid grid-cols-12 gap-5">

          {/* QR Card (8 cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-card p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left: text */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-50 text-verde-700 text-[10px] font-black uppercase tracking-widest mb-4">
                  <ShieldCheck className="w-3 h-3" />
                  Acceso Autorizado
                </span>
                <h2 className="text-2xl font-black text-navy-900 mb-3 leading-tight">
                  Mi Código QR<br/>de Emergencia
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  En caso de emergencia, el personal médico puede escanear este código para acceder
                  instantáneamente a tu historial crítico sin necesidad de desbloquear tu dispositivo.
                </p>

                <div className="inline-flex items-center gap-2.5 bg-verde-50 border border-verde-100 rounded-xl px-4 py-2.5">
                  <span className="w-2 h-2 rounded-full bg-verde-500" />
                  <div>
                    <p className="text-xs font-bold text-verde-800">Actualizado recientemente</p>
                    <p className="text-[10px] text-verde-700">Último cambio: 12 de Octubre, 2023</p>
                  </div>
                </div>
              </div>

              {/* Right: QR */}
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-5 relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-verde-100/40 to-transparent rounded-3xl blur-md -z-10" />
                  <QRPlaceholder />
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-canvas rounded-full border border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-verde-500 animate-pulse" />
                  <span className="text-navy-900 text-xs font-black tracking-wider">VITALCODE ID: VC-8829-X</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side cards (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
            {/* Grupo Sanguíneo */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <p className="text-xs font-semibold text-gray-500 mb-2">Grupo Sanguíneo</p>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black text-navy-900 tracking-tight">O+</p>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-red-500" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* EPS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-verde-600" />
                <p className="text-xs font-semibold text-gray-500">Entidad Prestadora (EPS)</p>
              </div>
              <p className="text-lg font-black text-navy-900 leading-tight">Sura Medicina<br/>Prepagada</p>
              <p className="text-xs text-gray-500 mt-2"><span className="font-bold text-navy-900">Plan:</span> Excelencia Global</p>
            </div>

            {/* Aviso de Privacidad */}
            <div className="rounded-2xl p-5 relative overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d2147 100%)' }}>
              <Lock className="absolute right-4 top-4 w-12 h-12 text-white/5" />
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-verde-400" />
                <p className="text-sm font-bold text-white">Aviso de Privacidad</p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed relative z-10">
                Tus datos están encriptados bajo la norma HIPAA. Solo tú y el personal
                médico autorizado pueden acceder a esta información.
              </p>
            </div>
          </div>
        </div>

        {/* Alergias + Medicamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Alergias */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-black text-navy-900">Alergias Conocidas</p>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black tracking-wider">
                {alergias.length} ALERTAS
              </span>
            </div>
            <div className="space-y-3">
              {alergias.map((a) => (
                <div key={a.nombre} className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center`}>
                      {a.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">{a.nombre}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                        REACCIÓN: {a.reaccion}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${a.nivelCls}`}>
                    {a.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Medicamentos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-black text-navy-900">Medicamentos Activos</p>
              <button className="text-xs font-bold text-verde-600 hover:text-verde-700">Ver Recetas</button>
            </div>
            <div className="space-y-3">
              {medicamentos.map((m) => (
                <div key={m.nombre}
                     className={`p-4 rounded-xl border ${
                       m.destacado
                         ? 'border-l-4 border-l-verde-500 border-y-verde-100 border-r-verde-100 bg-verde-50/40'
                         : 'border-gray-100 bg-white'
                     }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-navy-900">{m.nombre}</p>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                      m.destacado ? 'bg-verde-100 text-verde-700' : 'text-gray-500'
                    }`}>
                      {m.frecuencia}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Próxima: {m.proxima}
                    </span>
                    {m.diasRestantes && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {m.diasRestantes} días restantes
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-navy-900">VitalCode Data Protection</p>
              <p className="text-[11px] text-gray-500">Tu salud, protegida por tecnología de grado militar.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {['Términos de Servicio', 'Privacidad', 'Contactar Soporte'].map((l) => (
              <button key={l} className="text-xs text-gray-500 hover:text-navy-900 transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
