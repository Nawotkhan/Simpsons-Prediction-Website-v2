import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function Dashboard() {
  const { user }               = useAuth();
  const [myPreds, setMyPreds]  = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    axios.get('/api/predictions')
      .then(({ data }) => {
        setMyPreds(data.filter(p => p.submittedBy?._id === user?.id || p.submittedBy === user?.id));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    await axios.delete(`/api/predictions/${id}`);
    setMyPreds(prev => prev.filter(p => p._id !== id));
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
                  <button className="btn-sp btn-sp-danger" style={{fontSize:'0.8rem',padding:'0.3rem 0.9rem'}} onClick={() => del(p._id)}>Delete</button>
                </div>
              ))}
            </div>
          )
        }
      </main>
    </div>
  );
}