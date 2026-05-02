import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function CtaFinal() {
    return (
        <section className="py-24 px-8 text-center bg-white">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-1.5 mb-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`rounded-full ${i === 1 ? 'bg-verde-500 w-12 h-3' : 'bg-verde-200 w-3 h-3'}`} />
                    ))}
                    <span className="ml-2 text-xs font-bold text-verde-600">+10k</span>
                </div>
                <h2 className="text-4xl font-black text-navy-900 mb-4 tracking-tight">
                    Únete a la red de protección<br />médica más avanzada
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
    );
}