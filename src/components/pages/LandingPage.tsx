import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import HeroSection from '../../features/landing/components/HeroSection';
import ProtocoloSection from '../../features/landing/components/ProtocoloSection';
import BeneficiosSection from '../../features/landing/components/BeneficiosSection';
import SeguridadSection from '../../features/landing/components/SeguridadSection';
import CtaFinal from '../../features/landing/components/CtaFinal';


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-navy-900">
            <Navbar />

            
            <div id="top" />

            <main>
                <HeroSection />
                <ProtocoloSection />
                <BeneficiosSection />
                <SeguridadSection />
                <CtaFinal />
            </main>

            <Footer />
        </div>
    );
}