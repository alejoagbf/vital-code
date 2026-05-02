import { Headphones } from 'lucide-react';
import AuthHeader from '../../features/auth/components/AuthHeader';
import LoginForm from '../../features/auth/components/LoginForm';
import AuthFooter from '../../features/auth/components/AuthFooter';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4 py-12 relative">

            {/* Card Principal */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                <AuthHeader />
                <LoginForm />
            </div>

            <AuthFooter />

            {/* Support bubble */}
            <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center shadow-lg hover:bg-navy-800 transition-colors">
                <Headphones className="w-5 h-5 text-white" />
            </button>
        </div>
    );
}