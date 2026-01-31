import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BoardDetails from './pages/BoardDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                <Route element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/board/:id" element={<BoardDetails />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
