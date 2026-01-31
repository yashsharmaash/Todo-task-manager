import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, LogOut, Menu, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
        // Add more here if needed
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col glass border-r-0">
            <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                    <FolderKanban className="h-6 w-6 text-primary-400" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">TaskFlow</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary-500/20 text-primary-300 font-semibold shadow-sm ring-1 ring-primary-500/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={clsx("h-5 w-5", isActive ? "text-primary-400" : "text-gray-500")} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
                <div className="mt-4 px-4 flex items-center space-x-3 text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-white/10">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <span className="truncate font-medium text-gray-300">{user?.email}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 fixed h-full z-10">
                <SidebarContent />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 flex items-center justify-between p-4 px-6">
                <div className="flex items-center space-x-2">
                    <FolderKanban className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-lg">TaskFlow</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-600">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden fixed inset-0 bg-black z-30"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-40 shadow-xl"
                        >
                            <SidebarContent />
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
