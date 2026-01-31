import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Circle, Trash2, Calendar } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const BoardDetails = () => {
    const { id } = useParams();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    const fetchTodos = async () => {
        try {
            const { data } = await api.get(`/todos/${id}`);
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [id]);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Adding task...');
        try {
            const { data } = await api.post('/todos', {
                title: newTodo,
                boardId: id
            });
            setNewTodo('');
            setTodos(prev => [...prev, data]);
            toast.success('Task added!', { id: toastId });
        } catch (error) {
            toast.error('Failed to add task', { id: toastId });
        }
    };

    const toggleStatus = async (todo) => {
        const newStatus = todo.status === 'done' ? 'todo' : 'done';
        setTodos(prev => prev.map(t => t._id === todo._id ? { ...t, status: newStatus } : t));

        try {
            await api.put(`/todos/id/${todo._id}`, { status: newStatus });
            if (newStatus === 'done') toast.success('Task completed!');
        } catch (error) {
            toast.error('Failed to update status');
            fetchTodos();
        }
    };

    const handleDelete = async (todoId) => {
        const previousTodos = [...todos];
        setTodos(prev => prev.filter(t => t._id !== todoId));

        try {
            await api.delete(`/todos/id/${todoId}`);
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
            setTodos(previousTodos);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <Loader count={4} />
            </div>
        );
    }

    const todoCount = todos.filter(t => t.status === 'todo').length;
    const doneCount = todos.filter(t => t.status === 'done').length;
    const progress = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-8 ">
                <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-6 transition font-medium">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Board Tasks</h1>
                    <div className="flex items-center space-x-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10 shadow-sm backdrop-blur-md">
                        <div className="text-sm">
                            <span className="font-bold text-white">{doneCount}</span>
                            <span className="text-gray-400 ml-1">Done</span>
                        </div>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="text-sm">
                            <span className="font-bold text-white">{todoCount}</span>
                            <span className="text-gray-400 ml-1">To Do</span>
                        </div>
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Input */}
            <div className="glass bg-slate-800/40 p-2 rounded-2xl mb-8 border-white/10 focus-within:ring-2 ring-primary-500/40 transition-all">
                <form onSubmit={handleAddTodo} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="flex-1 pl-4 pr-4 py-3 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 font-medium"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newTodo.trim()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-500/20"
                    >
                        Add Task
                    </button>
                </form>
            </div>

            {/* Task List */}
            <motion.div layout className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {todos.map((todo) => (
                        <motion.div
                            key={todo._id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={clsx(
                                "group flex items-center justify-between p-4 bg-slate-800/40 border rounded-xl transition-all duration-200 hover:shadow-md hover:bg-slate-800/60",
                                todo.status === 'done' ? "border-transparent bg-slate-800/20" : "border-white/5 shadow-sm"
                            )}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => toggleStatus(todo)}
                                    className={clsx(
                                        "transition-all duration-200 transform hover:scale-110",
                                        todo.status === 'done' ? "text-green-500" : "text-gray-500 hover:text-primary-400"
                                    )}
                                >
                                    {todo.status === 'done' ?
                                        <CheckCircle className="h-6 w-6" /> :
                                        <Circle className="h-6 w-6" />
                                    }
                                </button>
                                <span className={clsx(
                                    "text-lg transition-all duration-200 font-medium",
                                    todo.status === 'done' ? "text-gray-500 line-through decoration-gray-600" : "text-gray-200"
                                )}>
                                    {todo.title}
                                </span>
                            </div>

                            <button onClick={() => handleDelete(todo._id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition opacity-0 group-hover:opacity-100">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {todos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="inline-flex p-4 bg-slate-800/50 rounded-full mb-4 shadow-sm border border-white/5">
                            <CheckCircle className="h-8 w-8 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white">All caught up!</h3>
                        <p className="text-gray-500">No tasks on this board yet. Add one above.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default BoardDetails;
