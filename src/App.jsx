import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; 
import HomePage from './pages/HomePage';
import AirControlPage from './pages/AirControlPage';
import AirHistoryPage from './pages/AirHistoryPage';
import TempCheckPage from './pages/TempCheckPage';
import TempHistoryPage from './pages/TempHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CctvPage from './pages/CctvPage';
import SystemInfoPage from './pages/SystemInfoPage';
import SystemConsolePage from './pages/SystemConsolePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route path="/aircon/control" element={<ProtectedRoute><AirControlPage /></ProtectedRoute>} />
        <Route path="/aircon/history" element={<ProtectedRoute><AirHistoryPage /></ProtectedRoute>} />
        <Route path="/temp/check" element={<ProtectedRoute><TempCheckPage /></ProtectedRoute>} />
        <Route path="/temp/history" element={<ProtectedRoute><TempHistoryPage /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/cctv" element={<ProtectedRoute><CctvPage /></ProtectedRoute>} />
        <Route path="/system" element={<ProtectedRoute><SystemInfoPage /></ProtectedRoute>} />
        <Route path="/console" element={<ProtectedRoute><SystemConsolePage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;