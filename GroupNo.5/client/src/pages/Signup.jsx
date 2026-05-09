import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', form);
      login(data);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/The_Simpsons_yellow_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="Simpsons" className="auth-logo" />
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join the world of Simpsons prophecy</p>
        {error && <div className="auth-err">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          <label>Full Name</label>
          <input type="text"     name="name"       value={form.name}       onChange={handle} required placeholder="Your Name"/>
          <label>Email</label>
          <input type="email"    name="email"      value={form.email}      onChange={handle} required placeholder="your@email.com"/>
          <label>Password</label>
          <div className="pwd-wrap">
            <input type={showPassword ? "text" : "password"} name="password"   value={form.password}   onChange={handle} required placeholder="Min 6 characters" minLength={6}/>
            <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <button type="submit" className="btn-sp btn-sp-primary auth-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}