import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, setToken }     = useAuth();   
  const [form,    setForm]                 = useState({ name:'', email:'', university:'', semester:'', avatar:'' });
  const [preview, setPreview]              = useState('');
  const [success, setSuccess]              = useState('');
  const [error,   setError]               = useState('');
  const [loading, setLoading]             = useState(false);

  // Populate form from server on mount
  useEffect(() => {
    axios.get('/api/auth/profile')
      .then(({ data }) => {
        setForm({
          name:       data.name        || '',
          email:      data.email       || '',
          university: data.university  || '',
          semester:   data.semester    || '',
          avatar:     data.avatar      || '',
        });
        setPreview(data.avatar || '');
      })
      .catch(() => setError('Could not load profile.'));
  }, []);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'avatar') setPreview(value);  // live preview of avatar URL
  };

  const submit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      // FIX: backend now returns { token, user } — update both
      const { data } = await axios.put('/api/auth/profile', form);
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        if (setToken) setToken(data.token);         // keep AuthContext in sync
      }
      updateUser({ ...user, name: data.user.name, email: data.user.email, avatar: data.user.avatar });
      setPreview(data.user.avatar || '');
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="page-wrapper profile-main">
        <h1 className="section-title" style={{ textAlign: 'left' }}>My Profile</h1>
        <div className="profile-card fade-up">

          {/* FIX: avatar preview updates live as user types the URL */}
          <div className="profile-avatar-wrap">
            {preview
              ? <img
                  src={preview}
                  alt="avatar"
                  className="profile-avatar-img"
                  onError={() => setPreview('')}   // fall back to initials if URL is broken
                />
              : <div className="profile-avatar-placeholder">
                  {form.name?.[0]?.toUpperCase() || 'U'}
                </div>
            }
          </div>
          <h2 className="profile-name">{form.name}</h2>
          <span className="profile-role">{user?.role}</span>

          {error   && <div className="auth-err">{error}</div>}
          {success && (
            <div style={{
              background:'rgba(6,214,160,0.12)', border:'1px solid #06D6A0',
              color:'#06D6A0', padding:'0.65rem 1rem', borderRadius:'10px',
              fontSize:'0.9rem', marginBottom:'0.8rem'
            }}>{success}</div>
          )}

          <form onSubmit={submit} className="profile-form">
            {[
              { label:'Full Name',  name:'name',       type:'text'  },
              { label:'Email',      name:'email',      type:'email' },
              { label:'University', name:'university', type:'text'  },
              { label:'Semester',   name:'semester',   type:'text'  },
              { label:'Avatar URL', name:'avatar',     type:'url',  placeholder:'https://example.com/photo.jpg' },
            ].map(f => (
              <div key={f.name} className="pf-group">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handle}
                  placeholder={f.placeholder || ''}
                />
              </div>
            ))}
            <button type="submit" className="btn-sp btn-sp-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}