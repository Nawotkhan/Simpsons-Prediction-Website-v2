import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const links = [
    { to: '/episodes',    label: 'Browse Episodes'    },
    { to: '/predictions', label: 'Browse Predictions' },
    { to: '/dashboard',   label: 'My Predictions'     },
    { to: '/bookmarks',   label: 'Bookmarks'          },
    { to: '/profile',     label: 'Profile'            },
  ];

  return (
    <aside className="sp-sidebar">
      <div className="sidebar-brand">SimPredictions</div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>
        Logout
      </button>
    </aside>
  );
}