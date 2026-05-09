import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/The_Simpsons_yellow_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="Simpsons" className="auth-logo" />
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to explore Simpsons predictions</p>
        {error && <div className="auth-err">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handle} required placeholder="your@email.com"/>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handle} required placeholder="Password"/>
          <button type="submit" className="btn-sp btn-sp-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">No account? <Link to="/signup">Sign Up</Link></p>
        <p className="auth-switch" style={{marginTop:'0.5rem', fontSize:'0.8rem'}}>
          Admin login: admin@simpredictions.com / Admin@1234
        </p>
      </div>
    </div>
  );
}