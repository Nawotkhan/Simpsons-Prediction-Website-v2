import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Episodes.css';

const EPISODES = [
  { num:1,  title:'Bart Gets an F',                season:'S2 E1 (1990)',  embed:"https://www.youtube.com/embed/Wv9mjg19-gE", desc:'Bart faces academic failure and emotional breakdown, mirroring the global student mental health crisis decades before it became a mainstream concern.' },
  { num:2,  title:'Homer vs. Patty and Selma',     season:'S6 E17 (1995)', embed:'https://www.youtube.com/embed/orQ7Zytz4cI', desc:'Homer drives a limo for cash, prefiguring the entire gig economy and rideshare culture that Uber and Lyft would bring 14 years later.' },
  { num:3,  title:"Lisa's Wedding",                season:'S6 E19 (1995)', embed:'https://www.youtube.com/embed/HfWfsabDKOA', desc:'Set in 2010, the episode depicts smartwatches and FaceTime-style video calls, both of which became consumer reality by 2014.' },
  { num:4,  title:'Bart to the Future',            season:'S11 E17 (2000)',embed:'https://www.youtube.com/embed/ZtparSnQhFc', desc:'Lisa becomes President inheriting a budget crisis left by President Trump which was aired in 2000, 16 years before the 2016 US election.' },
  { num:5,  title:'When You Dish Upon a Star',     season:'S10 E5 (1998)', embed:'https://www.youtube.com/embed/qx7P7QJrmW0', desc:'A background sign reads "20th Century Fox, A Division of Walt Disney Co." in 1998, predicting the $71.3 billion Disney-Fox deal of 2019.' },
  { num:6,  title:'Homer the Whopper',             season:'S21 E1 (2009)', embed:'https://www.youtube.com/embed/kC9TBp_i0X4', desc:"Homer is cast in a superhero blockbuster, mirroring the MCU's dominance of global cinema through the 2010s." },
  { num:7,  title:'The Wizard of Evergreen Terrace',season:'S10 E2 (1998)',embed:'https://www.youtube.com/embed/Amv3ocVh3UE', desc:"Homer's chalkboard equation was found to predict a Higgs boson mass consistent with CERN's 2012 discovery." },
  { num:8,  title:'Marge in Chains',               season:'S4 E21 (1993)', embed:'https://www.youtube.com/embed/8geaxjz9RZw', desc:'A flu virus called the "Osaka Flu" originates in Japan and sweeps through Springfield, mapping almost exactly onto the COVID-19 pandemic of 2020.' },
  { num:9,  title:'Elementary School Musical',     season:'S22 E1 (2010)', embed:'https://www.youtube.com/embed/Fodo1Wo77bk', desc:"Lady Gaga is shown descending from the sky in a theatrical performance, presaging her iconic 2017 Super Bowl LI halftime show." },
  { num:10, title:"Bart's Dog Gets an F",          season:'S2 E16 (1991)', embed:'https://www.youtube.com/embed/JPAqq41Klhc', desc:'Premium dog obedience school is portrayed as a serious professional service which is now a $150 billion global industry as of 2023.' },
];

export default function Episodes() {
  const [search, setSearch]  = useState('');
  const navigate = useNavigate();

  const filtered = EPISODES.filter(ep =>
    ep.title.toLowerCase().includes(search.toLowerCase()) ||
    ep.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper episodes-page">
      <h1 className="section-title">Prediction Episodes</h1>
      <p className="ep-intro">Ten episodes that hid clues about the future. Watch each one, then explore the Predictions page.</p>
      <div className="ep-search-wrap">
        <input className="ep-search" placeholder="Search episodes..." value={search} onChange={e => setSearch(e.target.value)}/>
      </div>
      <div className="ep-list">
        {filtered.map((ep,i) => (
          <div className="ep-row fade-up" key={ep.num} style={{animationDelay:`${i*0.06}s`}}>
            <div className="ep-num-badge">{String(ep.num).padStart(2,'0')}</div>
            <div className="ep-content">
              <div className="ep-header">
                <h3 className="ep-title">{ep.title}</h3>
                <span className="ep-season">{ep.season}</span>
              </div>
              <div className="ep-video-wrap">
                <iframe src={ep.embed} title={ep.title} frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen/>
              </div>
              <p className="ep-desc">{ep.desc}</p>
              <button className="btn-sp btn-sp-outline ep-pred-btn" onClick={() => navigate('/predictions', { state: { ep: ep.num } })}>
                View Prediction
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}