import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, UserPlus } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-8 bg-canvas">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde-50 border border-verde-100 text-verde-700 text-xs font-bold mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-verde-500" />
                        Tecnología Médica de Vanguardia
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-navy-900 leading-[1.05] mb-6 tracking-tight">
                        Información que <span className="text-verde-500">salva vidas</span>, a un click.
                    </h1>
                    <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                        La plataforma líder en gestión de información médica de emergencia mediante códigos QR dinámicos. Tu historial, siempre contigo y bajo el respaldo de HealthTech S.A.S.
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
                <div className="relative hidden lg:block">
                    <div className="absolute -inset-6 bg-gradient-to-br from-verde-300/30 to-navy-500/20 rounded-[2.5rem] blur-2xl pointer-events-none" />
                    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-soft ring-1 ring-black/5 bg-gradient-to-br from-navy-100 to-navy-200">
                        <img
                            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=900&auto=format&fit=crop&q=80"
                            alt="Equipo médico revisando información"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const img = e.currentTarget;
                                if (!img.dataset.fallback) {
                                    img.dataset.fallback = '1';
                                    img.src = 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=900&auto=format&fit=crop&q=80';
                                } else {
                                    img.style.display = 'none';
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="absolute -bottom-5 left-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-soft border border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-verde-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-verde-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-navy-900">Respuesta Inmediata</p>
                            <p className="text-[11px] text-gray-500">Acceso en menos de 5s</p>
                        </div>
                    </div>
                    <div className="absolute -top-4 -right-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-navy-900 shadow-soft">
                        <div className="w-9 h-9 rounded-xl bg-verde-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-verde-300" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white">Datos Encriptados</p>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">AES-256 · HIPAA</p>
                        </div>
                    </div>
                    <div className="absolute top-1/2 -left-6 -translate-y-1/2 hidden xl:flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white shadow-soft border border-gray-100">
                        <p className="text-2xl font-black text-verde-600 leading-none">+10k</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Pacientes</p>
                    </div>
                </div>
            </div>
        </section>
    );
}