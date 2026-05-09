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
        <NavLink to="/home" className="sp-brand" onClick={() => setOpen(false)}>SimPredictions</NavLink>
        
        <div className={`sp-nav-menu ${open ? 'open' : ''}`}>
          <ul className="sp-nav-links">
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => 'sp-link' + (isActive ? ' active' : '')} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="sp-nav-right">
            {user?.role === 'admin' && (
              <span className="sp-admin-badge">Admin</span>
            )}
            <div className="sp-user-item">
              <NavLink to="/profile" className="sp-user-profile-link" onClick={() => setOpen(false)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="sp-user-avatar" />
                ) : (
                  <div className="sp-user-avatar-placeholder">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="sp-user-name">Hi, {user?.name}</span>
              </NavLink>
            </div>
            <button className="btn-sp btn-sp-outline sp-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <button className="sp-burger" onClick={() => setOpen(o => !o)}>
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}