export default function Footer() {
    return (
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
                    { title: 'Compañía', links: ['Sobre HealthTech', 'Privacidad de Datos', 'Términos Legales', 'Prensa'] },
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
    );
}