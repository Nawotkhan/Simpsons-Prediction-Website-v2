import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'1rem', position:'relative', zIndex:1, padding:'2rem' }}>
      <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'5rem', color:'var(--primary)', lineHeight:1 }}>404</h1>
      <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.8rem', color:'var(--text)' }}>D'oh! Page not found.</h2>
      <p style={{ color:'var(--text-muted)', maxWidth:'400px' }}>This page does not exist. Homer probably ate it.</p>
      <Link to="/home" className="btn-sp btn-sp-primary" style={{ marginTop:'1rem' }}>Go Home</Link>
    </div>
  );
}