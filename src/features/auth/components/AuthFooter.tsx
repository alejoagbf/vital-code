export default function AuthFooter() {
    return (
        <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white">
                <span className="w-2 h-2 rounded-full bg-verde-500" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Sistema Operativo · V.2.4.0
                </span>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-1">
                © 2024 VitalCode Healthcare Digital. Todos los derechos reservados.<br />
                Acceso restringido a personal autorizado.
            </p>
        </div>
    );
}