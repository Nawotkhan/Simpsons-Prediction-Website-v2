import { useBookmarks } from '../context/BookmarksContext';
import { useNavigate }  from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();

  // Guard — context might not be ready immediately
  if (!bookmarks) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="page-wrapper" style={{ flex:1 }}>
          <p style={{ padding:'2rem', color:'var(--text-muted)' }}>Loading bookmarks…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="page-wrapper" style={{ flex:1 }}>
        <h1 className="section-title" style={{ textAlign:'left' }}>
          Bookmarks {bookmarks.length > 0 && <span style={{ fontSize:'1rem', color:'var(--text-muted)' }}>({bookmarks.length})</span>}
        </h1>

        {bookmarks.length === 0 ? (
          <p style={{ textAlign:'center', color:'var(--text-muted)', padding:'3rem' }}>
            No bookmarks yet. Go to Predictions and click the bookmark icon on any episode card.
          </p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {bookmarks.map((b, i) => (
              <div
                key={b.num ?? i}
                style={{
                  background:'var(--card-bg)',
                  border:'2px solid var(--border)',
                  borderRadius:'16px',
                  padding:'1.2rem',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  gap:'1rem',
                  flexWrap:'wrap',
                  transition:'border-color 0.2s',
                }}
              >
                <div>
                  <div style={{ fontSize:'0.75rem', color:'var(--accent)', fontWeight:'700', textTransform:'uppercase', marginBottom:'0.2rem' }}>
                    Episode {b.num}
                  </div>
                  <h4 style={{ fontFamily:"'Fredoka One', cursive", fontSize:'1.15rem', color:'var(--primary)', marginBottom:'0.3rem' }}>
                    {b.title}
                  </h4>
                  {b.tag && <p style={{ fontSize:'0.88rem', color:'var(--text-muted)' }}>{b.tag}</p>}
                </div>
                <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                  <button
                    className="btn-sp btn-sp-outline"
                    style={{ fontSize:'0.82rem', padding:'0.3rem 0.9rem' }}
                    onClick={() => navigate('/predictions', { state: { ep: b.num } })}
                  >
                    View
                  </button>
                  <button
                    className="btn-sp btn-sp-danger"
                    style={{ fontSize:'0.82rem', padding:'0.3rem 0.9rem' }}
                    onClick={() => removeBookmark(b.num)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}