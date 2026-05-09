import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  const { user }               = useAuth();
  const [myPreds, setMyPreds]  = useState([]);
  const [allPreds, setAllPreds] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: predsData } = await axios.get('/api/predictions');
        setMyPreds(predsData.filter(p => p.submittedBy?._id === user?.id || p.submittedBy === user?.id));
        
        if (user?.role === 'admin') {
          setAllPreds(predsData);
          const { data: reviewsData } = await axios.get('/api/reviews');
          setAllReviews(reviewsData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const delPred = async (id, isMyPred) => {
    if (!window.confirm('Delete this prediction?')) return;
    try {
      await axios.delete(`/api/predictions/${id}`);
      if (isMyPred) {
        setMyPreds(prev => prev.filter(p => p._id !== id));
      }
      setAllPreds(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const delReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`/api/reviews/${id}`);
      setAllReviews(prev => prev.filter(r => r._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main page-wrapper">
        <h1 className="section-title" style={{textAlign:'left'}}>Dashboard</h1>
        <div className="dash-welcome">
          <h2>Welcome back, {user?.name}</h2>
          <p>Role: <span className={`role-badge ${user?.role}`}>{user?.role}</span></p>
        </div>

        {user?.role === 'admin' ? (
          <>
            <h3 className="dash-sub">Admin Panel - All Community Predictions</h3>
            {loading ? <p>Loading...</p> : allPreds.length === 0
              ? <p className="no-preds">No community predictions found.</p>
              : (
                <div className="my-preds-list">
                  {allPreds.map(p => (
                    <div className="my-pred-card" key={p._id}>
                      <div className="mpc-info">
                        <span className="upc-ep">Episode {p.episodeNumber} | By: {p.submittedBy?.name || 'Unknown'}</span>
                        <h4>{p.episodeTitle}</h4>
                        <p>{p.interpretation?.slice(0, 120)}...</p>
                      </div>
                      <button className="btn-sp btn-sp-danger" style={{fontSize:'0.8rem',padding:'0.3rem 0.9rem'}} onClick={() => delPred(p._id, false)}>Delete</button>
                    </div>
                  ))}
                </div>
              )
            }

            <h3 className="dash-sub" style={{ marginTop: '2rem' }}>Admin Panel - All Reviews</h3>
            {loading ? <p>Loading...</p> : allReviews.length === 0
              ? <p className="no-preds">No reviews found.</p>
              : (
                <div className="my-preds-list">
                  {allReviews.map(r => (
                    <div className="my-pred-card" key={r._id}>
                      <div className="mpc-info">
                        <span className="upc-ep">Rating: {r.rating}/5 | By: {r.username || 'Unknown'}</span>
                        <p>{r.reviewText}</p>
                      </div>
                      <button className="btn-sp btn-sp-danger" style={{fontSize:'0.8rem',padding:'0.3rem 0.9rem'}} onClick={() => delReview(r._id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )
            }
          </>
        ) : (
          <>
            <h3 className="dash-sub">My Submitted Predictions</h3>
            {loading ? <p>Loading...</p> : myPreds.length === 0
              ? <p className="no-preds">You have not submitted any predictions yet. Go to the Predictions page to add one.</p>
              : (
                <div className="my-preds-list">
                  {myPreds.map(p => (
                    <div className="my-pred-card" key={p._id}>
                      <div className="mpc-info">
                        <span className="upc-ep">Episode {p.episodeNumber}</span>
                        <h4>{p.episodeTitle}</h4>
                        <p>{p.interpretation?.slice(0, 120)}...</p>
                      </div>
                      <button className="btn-sp btn-sp-danger" style={{fontSize:'0.8rem',padding:'0.3rem 0.9rem'}} onClick={() => delPred(p._id, true)}>Delete</button>
                    </div>
                  ))}
                </div>
              )
            }
          </>
        )}
      </main>
    </div>
  );
}