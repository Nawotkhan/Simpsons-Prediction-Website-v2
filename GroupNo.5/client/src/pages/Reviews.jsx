import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

const SAMPLE = [
  { username: 'DoughnutDave', rating: 5, reviewText: 'The Osaka Flu breakdown alone is worth the visit. Incredibly well-researched.' },
  { username: 'YellowFamilyFan', rating: 5, reviewText: 'The Predictions page is spectacular — dates, references and real source links.' },
  { username: 'ChalkboardKid', rating: 4, reviewText: 'A physicist friend confirmed the Homer equation analysis was accurate.' },
  { username: 'Springfielder99', rating: 5, reviewText: 'Started with the Disney-Fox prediction and spent three hours here. Dark mode is gorgeous.' },
  { username: 'BartOnABoard', rating: 3, reviewText: 'Love the predictions content. Perfect with faster mobile video loading.' },
];

const Stars = ({ value, onChange }) => (
  <div className="star-row">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s} type="button"
        className={`star ${s <= value ? 'filled' : ''}`}
        onClick={() => onChange && onChange(s)}
      >
        {s <= value ? '★' : '☆'}
      </button>
    ))}
  </div>
);

export default function Reviews() {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 0, reviewText: '' });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // FIX: set auth header whenever token changes (was only running once)
  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/api/reviews');
      setReviews(data);
    } catch { }
  };

  const submit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (!form.rating) { setError('Please select a star rating.'); setLoading(false); return; }
    try {
      await axios.post('/api/reviews', form);
      setSuccess('Review submitted!');
      setForm({ rating: 0, reviewText: '' });
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/reviews/${id}`, editForm);
      setEditing(null);
      setEditForm({});
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  // FIX: Separate edit and delete permissions so admins can delete but not edit
  const canEdit = (r) => {
    if (!user) return false;
    const reviewUserId = r.user?._id ?? r.user;
    return String(reviewUserId) === String(user.id);
  };

  const canDelete = (r) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return canEdit(r);
  };

  return (
    <div className="page-wrapper reviews-page">
      <h1 className="section-title">Reviews</h1>

      {/* Submit form — only shown when logged in */}
      {user ? (
        <div className="rv-form-wrap fade-up">
          <h2 className="rv-form-title">Share Your Experience</h2>
          <p className="rv-form-sub">Tell the community what you found, what surprised you.</p>
          {error && <div className="rv-err">{error}</div>}
          {success && <div className="rv-ok">{success}</div>}
          <form onSubmit={submit} className="rv-form">
            <label>Your Rating</label>
            <Stars value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
            <label>Your Review</label>
            <textarea
              value={form.reviewText}
              onChange={e => setForm({ ...form, reviewText: e.target.value })}
              required rows={4}
              placeholder="What did you think?"
            />
            <button type="submit" className="btn-sp btn-sp-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
          Please log in to leave a review.
        </p>
      )}

      {/* Example / sample reviews */}
      <h2 className="rv-sub-title">What People Are Saying</h2>
      <div className="reviews-grid">
        {SAMPLE.map((r, i) => (
          <div className="rv-card fade-up" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="rv-header">
              <div className="rv-avatar">{r.username[0].toUpperCase()}</div>
              <div>
                <div className="rv-uname">{r.username}</div>
                <Stars value={r.rating} />
              </div>
            </div>
            <p className="rv-text">{r.reviewText}</p>
            <span className="rv-badge">Verified User</span>
          </div>
        ))}
      </div>

      {/* Live community reviews from DB */}
      {reviews.length > 0 && (
        <>
          <h2 className="rv-sub-title">Community Reviews</h2>
          <div className="reviews-grid">
            {reviews.map(r => (
              <div className="rv-card live-card" key={r._id}>
                {editing === r._id ? (
                  <div className="rv-edit">
                    <Stars
                      value={editForm.rating ?? r.rating}
                      onChange={v => setEditForm({ ...editForm, rating: v })}
                    />
                    <textarea
                      rows={3}
                      value={editForm.reviewText ?? r.reviewText}
                      onChange={e => setEditForm({ ...editForm, reviewText: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-sp btn-sp-primary" onClick={() => saveEdit(r._id)}>Save</button>
                      <button className="btn-sp btn-sp-outline" onClick={() => { setEditing(null); setEditForm({}); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rv-header">
                      <div className="rv-avatar" style={{ background: 'var(--accent)' }}>
                        {r.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="rv-uname">{r.username}</div>
                        <Stars value={r.rating} />
                      </div>
                    </div>
                    <p className="rv-text">{r.reviewText}</p>

                    {/* FIX: Admin can delete but only owner can edit */}
                    {(canEdit(r) || canDelete(r)) && (
                      <div className="rv-actions">
                        {canEdit(r) && (
                          <button
                            className="btn-sp btn-sp-outline"
                            style={{ fontSize: '0.78rem', padding: '0.28rem 0.75rem' }}
                            onClick={() => {
                              setEditing(r._id);
                              setEditForm({ rating: r.rating, reviewText: r.reviewText });
                            }}
                          >Edit</button>
                        )}
                        {canDelete(r) && (
                          <button
                            className="btn-sp btn-sp-danger"
                            style={{ fontSize: '0.78rem', padding: '0.28rem 0.75rem' }}
                            onClick={() => del(r._id)}
                          >Delete</button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}