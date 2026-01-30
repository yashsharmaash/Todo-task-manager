import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, CheckSquare, Shield, ArrowRight, Layout as LayoutIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login', { state: { isRegistering: true } });
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className="border-b border-white/5 glass sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-tr from-primary-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-primary-500/20">
                            <FolderKanban className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TaskFlow</span>
                    </div>
                    <div>
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="text-gray-300 hover:text-white font-medium transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 text-sm font-semibold text-primary-950 bg-green-500 hover:bg-gray-100 rounded-full transition shadow-lg hover:shadow-white/10"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-8 drop-shadow-2xl">
                        Organize your work, <br className="hidden sm:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300">
                            one board at a time.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                        The modern project management tool designed for individuals who want clarity, focus, and progress.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleGetStarted}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 shadow-lg shadow-primary-900/40 hover:-translate-y-1 transition-all duration-300 ring-2 ring-primary-500/50"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        <a href="#features" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all backdrop-blur-sm">
                            Learn more
                        </a>
                    </div>
                </motion.div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-primary-300 font-bold tracking-wide uppercase text-sm">Features</h2>
                        <p className="mt-2 text-4xl font-extrabold text-white">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: LayoutIcon,
                                color: "bg-blue-500/20 text-blue-300",
                                title: "Board Management",
                                desc: "Create dedicated workspaces for each project. Visualize your workflow with ease."
                            },
                            {
                                icon: CheckSquare,
                                color: "bg-green-500/20 text-green-300",
                                title: "Task Tracking",
                                desc: "Capture every detail. Add tasks, set due dates, and mark them as done in a snap."
                            },
                            {
                                icon: Shield,
                                color: "bg-purple-500/20 text-purple-300",
                                title: "Secure & Private",
                                desc: "Your data is encrypted and safe. Focus on your work, we handle the security."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 glass bg-slate-800/60 rounded-3xl hover:border-primary-400/50 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/10`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="glass border-t border-white/10 py-8 bg-slate-900/80">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <FolderKanban className="h-6 w-6 text-gray-400" />
                        <span className="text-lg font-bold text-gray-400">TaskFlow</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
