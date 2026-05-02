import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
                <a href="#top" className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-card border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src="/logo.svg" alt="VitalCode" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="leading-tight">
                        <span className="font-black text-navy-900 text-base">Vital<span className="text-verde-600">Code</span></span>
                        <span className="text-[9px] text-gray-400 block uppercase tracking-widest font-bold">Un producto de HealthTech</span>
                    </div>
                </a>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="#como-funciona" className="hover:text-navy-900 transition-colors">Cómo funciona</a>
                    <a href="#beneficios" className="hover:text-navy-900 transition-colors">Beneficios</a>
                    <a href="#seguridad" className="hover:text-navy-900 transition-colors">Seguridad</a>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-navy-900 transition-colors">
                        <LogIn className="w-4 h-4" /> Acceso
                    </Link>
                    <Link to="/register" className="btn-primary">
                        <UserPlus className="w-4 h-4" /> Registrarse
                    </Link>
                </div>
            </div>
        </nav>
    );
}