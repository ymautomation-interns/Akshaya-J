import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastViewport from './components/Toast';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import EmployeeProfile from './pages/EmployeeProfile';
import { ToastProvider } from './hooks/useToast.jsx';

export default function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employee/:id" element={<EmployeeProfile />} />
            <Route
              path="*"
              element={
                <div className="container" style={{ padding: '48px 24px' }}>
                  <NotFound title="Page not found" message="This page doesn't exist. Let's get you back on track." code="404" />
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}
