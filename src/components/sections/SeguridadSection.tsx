import { ShieldCheck, Zap } from 'lucide-react';

export default function SeguridadSection() {
    return (
        <section id="seguridad" className="py-24 px-8" style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d1f3c 100%)' }}>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 overflow-hidden shadow-lg">
                        <img src="/logo.svg" alt="VitalCode" className="w-12 h-12 object-contain" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-5 tracking-tight leading-tight">
                        Respaldo Corporativo<br />de Elite
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
                        VitalCode es una solución tecnológica desarrollada y soportada por <span className="text-white font-bold">HealthTech S.A.S.</span>, empresa líder en innovación de salud digital. Nuestra infraestructura cumple con los protocolos de seguridad de grado bancario y normativas internacionales HIPAA.
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
                        { icon: <ShieldCheck className="w-5 h-5 text-verde-400" />, title: 'Legalidad y Ética', desc: 'Cumplimiento estricto de la Ley 1581 de protección de datos personales.' },
                        { icon: <Zap className="w-5 h-5 text-verde-400" />, title: 'Soporte 24/7', desc: 'Un equipo de ingenieros y especialistas médicos monitoreando el sistema.' },
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
    );
}