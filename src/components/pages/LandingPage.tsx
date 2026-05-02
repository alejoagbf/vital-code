import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import HeroSection from '../sections/HeroSection';
import ProtocoloSection from '../sections/ProtocoloSection';
import BeneficiosSection from '../sections/BeneficiosSection';
import SeguridadSection from '../sections/SeguridadSection';
import CtaFinal from '../sections/CtaFinal';


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