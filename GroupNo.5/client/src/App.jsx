import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookmarksProvider } from './context/BookmarksContext';
import Navbar       from './components/Navbar';
import ThemeToggle  from './components/ThemeToggle';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Home         from './pages/Home';
import Episodes     from './pages/Episodes';
import Predictions  from './pages/Predictions';
import Reviews      from './pages/Reviews';
import Dashboard    from './pages/Dashboard';
import Profile      from './pages/Profile';
import Bookmarks    from './pages/Bookmarks';
import About        from './pages/About';
import NotFound     from './pages/NotFound';

const STATIC_STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  size:  Math.random() * 3 + 1,
  top:   Math.random() * 100,
  left:  Math.random() * 100,
  delay: Math.random() * 6,
  dur:   Math.random() * 3 + 2,
}));

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function AppInner() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sp_theme') || 'light');
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sp_theme', theme);
  }, [theme]);

  return (
    <>
      {/* Background scene */}
      <div className="scene-bg">
        <div className="sun" />
        {Array.from({length:12}).map((_,i) => <div key={i} className="cloud" />)}
        <div className="moon">
          <div className="moon-crater"/><div className="moon-crater"/><div className="moon-crater"/>
        </div>
        {STATIC_STARS.map(s => (
          <div key={s.id} className="star-static" style={{
            width: s.size+'px', height: s.size+'px',
            top: s.top+'%', left: s.left+'%',
            animationDelay: s.delay+'s', animationDuration: s.dur+'s',
          }}/>
        ))}
        {Array.from({length:8}).map((_,i) => <div key={i} className="star-shoot" />)}
      </div>

      {user && <Navbar />}

      <Routes>
        <Route path="/login"   element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup"  element={user ? <Navigate to="/home" replace /> : <Signup />} />
        <Route path="/"        element={<Navigate to={user ? "/home" : "/login"} replace />} />

        <Route path="/home"        element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/episodes"    element={<ProtectedRoute><Episodes /></ProtectedRoute>} />
        <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
        <Route path="/reviews"     element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/bookmarks"   element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/about"       element={<About />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>

      <ThemeToggle theme={theme} toggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookmarksProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </BookmarksProvider>
    </AuthProvider>
  );
}