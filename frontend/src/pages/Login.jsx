import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowLeft, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Default to registering if passed in state, otherwise false
    const [isRegistering, setIsRegistering] = useState(location.state?.isRegistering || false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Regex Utils
    // eslint-disable-next-line
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend Validation
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (isRegistering && !passwordRegex.test(password)) {
            setError("Password must be 8+ chars, with 1 uppercase, 1 lowercase, 1 number.");
            return;
        }

        setIsLoading(true);
        try {
            if (isRegistering) {
                await register(email, password);
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-8 rounded-3xl relative bg-slate-900/60 border-white/10"
            >
                <div className="absolute top-6 left-6">
                    <Link to="/" className="text-gray-500 hover:text-gray-300 transition">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </div>

                <div className="text-center mb-8 pt-6">
                    <div className="inline-flex p-3 bg-primary-500/20 rounded-2xl mb-4 ring-1 ring-primary-500/20">
                        <FolderKanban className="h-8 w-8 text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400 mt-2">
                        {isRegistering ? 'Start organizing your life today' : 'Enter your details to access your workspace'}
                    </p>
                </div>

                <AnimatePresence mode='wait'>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center"
                        >
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600 text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition duration-200 transform hover:scale-[1.01] shadow-lg shadow-primary-900/40 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-gray-500 hover:text-primary-400 font-medium text-sm transition-colors"
                    >
                        {isRegistering
                            ? 'Already have an account? Login'
                            : 'Don\'t have an account? Sign Up'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
