export default function AuthHeader() {
    return (
        <div className="flex flex-col items-center pt-10 pb-6 px-10 relative">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-verde-50/80 to-transparent pointer-events-none" />
            <div className="relative w-28 h-28 mb-2">
                <div className="absolute inset-0 bg-verde-100/60 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-white rounded-3xl shadow-card flex items-center justify-center">
                    <img src="/logo.svg" alt="VitalCode" className="w-20 h-20 object-contain" />
                </div>
            </div>
            <p className="mt-3 text-xl font-black text-navy-900 tracking-tight">
                Vital<span className="text-verde-600">Code</span>
            </p>
            <p className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mt-1">
                HealthTech Solutions
            </p>
        </div>
    );
}