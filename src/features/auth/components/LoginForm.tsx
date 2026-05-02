import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { login as loginApi } from '../api/authService';

export default function LoginForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ correo: '', contrasena: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.correo || !form.contrasena) {
            toast.error('Por favor completa todos los campos.');
            return;
        }
        setLoading(true);
        try {
            const user = await loginApi(form.correo, form.contrasena);
            toast.success(`¡Bienvenido, ${user.nombre}!`);
            navigate('/dashboard');
        } catch {
            toast.error('Correo o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-10 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Correo */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-navy-900">Correo electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="ejemplo@vitalcode.com"
                            className="form-input pl-10 w-full"
                            value={form.correo}
                            onChange={(e) => setForm({ ...form, correo: e.target.value })}
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-navy-900">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="form-input pl-10 pr-11 w-full"
                            value={form.contrasena}
                            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <button type="button" className="text-sm font-semibold text-verde-600 hover:text-verde-700 transition-colors">
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base justify-center"
                >
                    {loading ? (
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <>Entrar <LogIn className="w-4 h-4" /></>
                    )}
                </button>
            </form>

            <div className="my-5 border-t border-gray-100" />

            <p className="text-center text-sm text-gray-500">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="font-bold text-verde-600 hover:text-verde-700 transition-colors">
                    Regístrate ahora
                </Link>
            </p>
        </div>
    );
}