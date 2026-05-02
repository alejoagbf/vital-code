import { Check, ShieldCheck, Zap, Cloud } from 'lucide-react';

export default function BeneficiosSection() {
    return (
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
                    <div className="lg:col-span-7 rounded-3xl min-h-[380px] relative overflow-hidden grid md:grid-cols-2" style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d1f3c 100%)' }}>
                        <div className="p-10 flex flex-col justify-between relative z-10">
                            <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-verde-500 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                                    Para Pacientes
                                </span>
                                <h3 className="text-3xl font-black text-white mb-6 leading-tight">
                                    La voz de tu salud cuando tú no puedes hablar.
                                </h3>
                                <ul className="space-y-3">
                                    {['Alertas automáticas a familiares en caso de escaneo.', 'Privacidad total con controles de acceso por tiempo.'].map((b) => (
                                        <li key={b} className="flex items-start gap-2.5 text-sm text-gray-300">
                                            <Check className="w-4 h-4 text-verde-400 flex-shrink-0 mt-0.5" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative min-h-[260px] md:min-h-full overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&auto=format&fit=crop&q=80" alt="Paciente recibiendo atención" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
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

                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {[
                            { icon: <Zap className="w-6 h-6 text-verde-600" />, title: 'Velocidad Vital', desc: 'Acceso a datos críticos en menos de 5 segundos en cualquier lugar del mundo.' },
                            { icon: <Cloud className="w-6 h-6 text-verde-600" />, title: 'Nube Segura', desc: 'Sincronización instantánea en todos tus dispositivos y códigos impresos.' },
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
    );
}