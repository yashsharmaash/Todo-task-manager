import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Layout as LayoutIcon } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
            const { data } = await api.get('/boards');
            setBoards(data);
        } catch (error) {
            console.error('Failed to fetch boards', error);
            toast.error('Failed to load boards');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating board...');
        try {
            await api.post('/boards', { title: newBoardTitle });
            setNewBoardTitle('');
            setIsModalOpen(false);
            fetchBoards();
            toast.success('Board created!', { id: toastId });
        } catch (error) {
            toast.error('Failed to create board', { id: toastId });
        }
    };

    const handleDeleteBoard = async (e, id) => {
        e.preventDefault();
        if (!window.confirm("Are you sure? This will delete all tasks in this board.")) return;

        const toastId = toast.loading('Deleting board...');
        try {
            await api.delete(`/boards/${id}`);
            setBoards(prev => prev.filter(b => b._id !== id));
            toast.success('Board deleted', { id: toastId });
        } catch (error) {
            toast.error('Failed to delete board', { id: toastId });
            fetchBoards();
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-32 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-slate-800 rounded animate-pulse"></div>
                </div>
                <Loader count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">My Boards</h2>
                    <p className="text-gray-400 mt-1">Manage your projects and ideas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-6 py-3 bg-blue-500 text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1"
                >
                    <Plus className="h-5 w-5 mr-2 text-primary-600" />
                    New Board
                </button>
            </div>

            {boards.length === 0 ? (
                <EmptyState
                    title="No boards found"
                    description="Get started by creating your first project board to organize your tasks."
                    actionLabel="Create Board"
                    onAction={() => setIsModalOpen(true)}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {boards.map((board) => (
                            <motion.div
                                key={board._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -8 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            >
                                <Link
                                    to={`/board/${board._id}`}
                                    className="block glass p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300 group relative h-full bg-slate-800/40"
                                >
                                    <div className="w-12 h-12 bg-primary-500/10 text-primary-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                        <LayoutIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-primary-300 transition-colors">{board.title}</h3>
                                    <div className="flex items-center text-sm text-gray-400 mt-4">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Created {new Date(board.createdAt).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteBoard(e, board._id)}
                                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Create Board Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative glass bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-2 text-white">Create New Board</h3>
                            <p className="text-gray-400 mb-6">Give your new workspace a name</p>

                            <form onSubmit={handleCreateBoard}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Board Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Marketing Campaign"
                                        className="w-full p-4 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 text-white placeholder:text-gray-500 transition outline-none"
                                        value={newBoardTitle}
                                        onChange={(e) => setNewBoardTitle(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newBoardTitle.trim()}
                                        className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold shadow-lg shadow-primary-500/20"
                                    >
                                        Create Board
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
