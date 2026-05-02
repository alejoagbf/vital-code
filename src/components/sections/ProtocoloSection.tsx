import { UserPlus, FileText, QrCode, ArrowRight } from 'lucide-react';

export default function ProtocoloSection() {
    const steps = [
        { num: '01', title: 'Registro Seguro', icon: <UserPlus className="w-7 h-7 text-white" />, desc: 'Crea tu perfil encriptado. Cumplimos los estándares internacionales de protección de datos médicos.', tag: 'AES-256' },
        { num: '02', title: 'Historial Dinámico', icon: <FileText className="w-7 h-7 text-white" />, desc: 'Carga alergias, medicación y contactos. Actualiza tu información en tiempo real sin cambiar de código.', tag: 'Tiempo Real' },
        { num: '03', title: 'Portabilidad Total', icon: <QrCode className="w-7 h-7 text-white" />, desc: 'Genera tu QR único para brazaletes, tarjetas o digital. Acceso inmediato para paramédicos y doctores.', tag: 'Acceso 24/7' },
    ];

    return (
        <section id="como-funciona" className="relative py-28 px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #06101f 0%, #0a182e 50%, #0d1f3c 100%)' }}>
            <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-verde-500/10 blur-3xl" />
            <div className="absolute bottom-10 -right-20 w-[28rem] h-[28rem] rounded-full bg-navy-500/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-verde-400/5 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="relative max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
                    Protocolo de <span className="bg-gradient-to-r from-verde-300 to-verde-500 bg-clip-text text-transparent">Activación Vital</span>
                </h2>
                <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
                    Tres pasos simples que transforman la seguridad de tu salud personal y familiar. Diseñado para ser rápido, seguro y a prueba de emergencias.
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                    <div key={s.num} className="group relative rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm hover:border-verde-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-green overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, rgba(16,185,129,0.15), transparent 60%)' }} />
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-glow-green bg-gradient-to-br from-verde-400 to-verde-600">
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
                            {i < 2 && (
                                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-navy-900 border border-verde-500/30 items-center justify-center">
                                    <ArrowRight className="w-3 h-3 text-verde-400" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}