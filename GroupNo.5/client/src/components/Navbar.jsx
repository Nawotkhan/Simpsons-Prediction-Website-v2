import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/home',        label: 'Home'        },
    { to: '/episodes',    label: 'Episodes'    },
    { to: '/predictions', label: 'Predictions' },
    { to: '/reviews',     label: 'Reviews'     },
    { to: '/dashboard',   label: 'Dashboard'   },
    { to: '/about',       label: 'About'       },
  ];

  return (
    <nav className="sp-navbar">
      <div className="sp-nav-inner">
        <NavLink to="/home" className="sp-brand">SimPredictions</NavLink>
        <button className="sp-burger" onClick={() => setOpen(o => !o)}>
          <span/><span/><span/>
        </button>
        <ul className={`sp-nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => 'sp-link' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
          {user?.role === 'admin' && (
            <li><span className="sp-admin-badge">Admin</span></li>
          )}
          <li><span className="sp-user-name">Hi, {user?.name}</span></li>
          <li>
            <button className="btn-sp btn-sp-outline sp-logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}