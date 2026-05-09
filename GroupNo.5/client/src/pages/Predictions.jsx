import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarksContext';
import './Predictions.css';

const STATIC_PREDS = [
  { num:1,  title:'Bart Gets an F',                tag:'Mental Health Crisis',    color:'#FF6B6B',
    summary:"Bart's academic failure predicted the global student mental health epidemic.",
    interpretation:"The episode treated student academic pressure as a genuine mental health crisis decades before it became mainstream discourse.",
    realEvent:{ title:'Global Student Mental Health Crisis', date:'Documented widely from 2013', body:'WHO reported in 2021 that anxiety and depression among students had become a full-scale global crisis.' },
    bullets:['1990: Episode airs showing Bart in academic and emotional crisis','2013: CDC confirmed a 70% rise in anxiety-related school absences','2019: APA named academic pressure as the number one stress source for US teenagers','2021: WHO Mental Health Report confirmed global scale of student crisis'],
    images:['https://media.licdn.com/dms/image/v2/C4E12AQGRo8bAk-VPdA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520226234385?e=2147483647&v=beta&t=bRRQJ8W-4fT04ZwxAXe8raEDzhFD4msbH_PpwPXyjlA'],
    reference:{ label:'WHO Mental Health in Schools Report', url:'https://www.who.int/news-room/fact-sheets/detail/mental-health-of-adolescents' } },
  { num:2,  title:'Homer vs. Patty and Selma',     tag:'Gig Economy',             color:'#3A86FF',
    summary:"Homer's secret limo driving mirrored the rise of Uber and gig work 14 years early.",
    interpretation:"Homer taking informal paid driving work to survive debt is the exact economic model that defines millions of workers today.",
    realEvent:{ title:'Rise of Uber and the Gig Economy', date:'Uber founded March 2009', body:'By 2023, over 59 million Americans participated in gig work.' },
    bullets:['1995: Homer does secret limo driving for cash','2009: Uber founded','2023: 59 million Americans are gig workers (Statista)','IMF flagged gig economy as structural shift in 2018'],
    images:['https://deadhomersociety.wordpress.com/wp-content/uploads/2020/02/homer-vs-patty-selma22.png?w=584'],
    reference:{ label:'Statista Gig Economy Report', url:'https://www.statista.com/topics/4891/gig-economy/' } },
  { num:3,  title:"Lisa's Wedding",                tag:'Smartwatches and FaceTime', color:'#8338EC',
    summary:'1995 episode depicted smartwatches and video calling, both real by 2014.',
    interpretation:'Characters spoke into wrist devices and made face-to-face video calls in a future set in 2010.',
    realEvent:{ title:'Apple Watch and FaceTime', date:'FaceTime June 2010, Apple Watch September 2014', body:'Both technologies matched the episode depiction almost to the predicted year.' },
    bullets:['1995: Episode depicts wrist video devices and face-to-face video calls','June 2010: FaceTime launched exactly the year shown in the episode','2014: Apple Watch launched wrist communication as depicted'],
    images:['https://mediaproxy.snopes.com/width/1200/height/1200/https://media.snopes.com/2019/11/Featured-Photo-Blur4-1.png'],
    reference:{ label:'Apple.com: Apple Watch Launch', url:'https://www.apple.com/newsroom/2014/09/09Apple-Unveils-Apple-Watch-Apples-Most-Personal-Device-Ever/' } },
  { num:4,  title:'Bart to the Future',            tag:'Trump Presidency',         color:'#FB5607',
    summary:'Named President Trump in 2000, 16 years before the 2016 election.',
    interpretation:'Writer Dan Greaney confirmed the episode was a deliberate cautionary satire about a TV personality becoming president.',
    realEvent:{ title:'Donald Trump Elected US President', date:'November 8, 2016', body:'Trump won the 2016 election, making this the most cited political prediction in the show.' },
    bullets:['March 2000: Episode airs naming President Trump explicitly','November 2016: Trump elected 45th US President','Writer Dan Greaney stated the episode was a warning to America','Cited in over 200 major publications after the 2016 result'],
    images:['https://ichef.bbci.co.uk/ace/branded_news/1200/cpsprodpb/2394/production/_92380190_trumpsimpsons2.jpg'],
    reference:{ label:'BBC: Simpsons Predicted Trump', url:'https://www.bbc.com/news/entertainment-arts-37936369' } },
  { num:5,  title:'When You Dish Upon a Star',     tag:'Disney Buys Fox',          color:'#06D6A0',
    summary:'Disney-Fox logo shown in 1998 background, 21 years before the $71.3B acquisition.',
    interpretation:'A throwaway background gag showed the exact corporate structure that became reality in 2019.',
    realEvent:{ title:'Disney Acquires 21st Century Fox', date:'March 20, 2019', body:'Disney completed a $71.3 billion acquisition of Fox entertainment assets.' },
    bullets:['1998: Disney/Fox logo shown as background gag','December 2017: Disney announces Fox acquisition for $52.4B','March 2019: Deal completed at $71.3 billion'],
    images:['https://qz.com/cdn-cgi/image/width=1920,quality=85,format=auto/https://assets.qz.com/media/2969af93f7a92c5a0b355eebfbb85c87.jpg'],
    reference:{ label:'QZ: Disney Completes Fox Deal', url:'https://qz.com/1156622/the-simpsons-predicted-the-disney-takeover-of-20th-century-fox-in-1998' } },
  { num:6,  title:'Homer the Whopper',             tag:'Superhero Movie Boom',     color:'#FFB703',
    summary:'Homer stars in a superhero film in 2009, exactly as the MCU was launching.',
    interpretation:'The episode satirised the comic-book blockbuster phenomenon just as Iron Man launched the MCU.',
    realEvent:{ title:'MCU Dominates Global Box Office 2008-Present', date:'Iron Man launched May 2008', body:'By 2023 the MCU grossed over $29 billion across 32 films.' },
    bullets:['2009: Episode airs mocking superhero franchise culture','2008: Iron Man launches the MCU','2019: Avengers Endgame earns $2.79B globally'],
    images:['https://variety.com/wp-content/uploads/2021/06/Loki-Simpsons.jpg'],
    reference:{ label:'Variety.com: Loki as Marvel', url:'https://variety.com/2021/tv/news/the-simpsons-loki-marvel-al-jean-1235013092/' } },
  { num:7,  title:'The Wizard of Evergreen Terrace',tag:'Higgs Boson Formula',    color:'#4CC9F0',
    summary:"Homer's 1998 chalkboard equation was found to predict the Higgs boson mass.",
    interpretation:"A throwaway visual gag turned out to be mathematically consistent with CERN's 2012 particle discovery.",
    realEvent:{ title:'Higgs Boson Discovery at CERN', date:'July 4, 2012', body:'Dr Simon Singh verified the formula predicted a Higgs boson mass consistent with experimental data.' },
    bullets:['1998: Homer writes equation on chalkboard','July 4 2012: CERN confirms Higgs boson discovery','Dr Simon Singh confirmed the formula was mathematically consistent'],
    images:['https://s.abcnews.com/images/GMA/150403_dvo_pop_homer_4x3t_992.jpg'],
    reference:{ label:'ABC News: Homer Higgs Boson', url:'https://abcnews.com/Entertainment/homer-simpson-figured-higgs-boson-14-years-scientists/story?id=29380004' } },
  { num:8,  title:'Marge in Chains',               tag:'Global Pandemic',          color:'#E63946',
    summary:'A flu virus from Japan sweeps Springfield in 1993, 27 years before COVID-19.',
    interpretation:"The episode's depiction of supply shortages, overwhelmed hospitals and public panic maps almost exactly onto 2020.",
    realEvent:{ title:'COVID-19 Global Pandemic', date:'WHO declared pandemic March 11, 2020', body:'COVID-19 originated in Asia, spread globally, caused healthcare crises and supply chain failures.' },
    bullets:['1993: Osaka Flu episode depicts Asian origin pandemic','December 2019: COVID-19 identified in Wuhan China','March 2020: WHO declares global pandemic','Supply shortages and overwhelmed hospitals matched the episode almost scene for scene'],
    images:['https://i1.wp.com/decider.com/wp-content/uploads/2020/02/simpsons-corona-virus.jpg'],
    reference:{ label:'REUTERS COVID-19 Pandemic', url:'https://www.reuters.com/article/world/partly-false-claim-a-1993-simpsons-episode-predicted-the-new-coronavirus-outbre-idUSKBN21112Q/' } },
  { num:9,  title:'Elementary School Musical',     tag:'Lady Gaga Super Bowl',     color:'#C77DFF',
    summary:'Gaga shown performing a theatrical aerial show in 2012, which happened at Super Bowl LI in 2017.',
    interpretation:'The episode showed Gaga descending from a great height in a stadium performance five years before her actual Super Bowl entrance.',
    realEvent:{ title:'Lady Gaga Super Bowl LI Halftime Show', date:'February 5, 2017', body:'Gaga descended from the stadium roof via wire harness, matching the Simpsons depiction in detail.' },
    bullets:['2012: Episode shows Gaga descending from height in theatrical performance','February 5 2017: Gaga performs at Super Bowl LI in Houston','117 million viewers watched the most-cited Simpsons prediction come true'],
    images:['https://d33iur4yq2h8v1.cloudfront.net/videos/video_thumb/XL/UqyIn0868J_IKmntMk7.jpg'],
    reference:{ label:'US Magazine Lady Gaga Performance', url:'https://www.usmagazine.com/entertainment/news/the-simpsons-predicted-lady-gagas-super-bowl-performance-in-2012-w465239/' } },
  { num:10, title:"Bart's Dog Gets an F",          tag:'Luxury Pet Economy',       color:'#2EC4B6',
    summary:"Premium pet school in 1991 predicted the $150 billion global pet care industry.",
    interpretation:'The episode treated pet training as a serious professional service with high fees now a mainstream global industry.',
    realEvent:{ title:'Global Pet Care Industry Reaches $150 Billion', date:'APPA Report 2023', body:'Americans alone spent $147 billion on pet products and services in 2023.' },
    bullets:['1991: Episode portrays premium professional pet obedience school','2010: US pet industry crosses $50 billion annually','2023: Global pet care market valued at over $150 billion'],
    images:["https://m.media-amazon.com/images/M/MV5BNmY2ZGU5MjUtOGI1Yy00ZDIwLWEwZTAtYmI4OGFiOTdmY2Y3XkEyXkFqcGc@._V1_.jpg"],
    reference:{ label:'APPA Pet Owners Survey', url:'https://www.petfoodindustry.com/news-newsletters/pet-food-news/article/15454954/appa-releases-2010-pet-industry-spending-figures-2011-pet-owners-survey#:~:text=The%20American%20Pet%20Products%20Association,billion%20in%202010%2C%20APPA%20found.' } },
];

export default function Predictions() {
  const { user }                          = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const location                          = useLocation();
  const [active,  setActive]              = useState(location.state?.ep || null);
  const [search,  setSearch]              = useState('');
  const [userPreds, setUserPreds]         = useState([]);
  const [showForm, setShowForm]           = useState(false);
  const [form, setForm]                   = useState({ episodeNumber:'', episodeTitle:'', interpretation:'', timeline:'', references:'' });
  const [editId, setEditId]               = useState(null);
  const [formErr, setFormErr]             = useState('');

  useEffect(() => { fetchUserPreds(); }, []);

  const fetchUserPreds = async () => {
    try { const { data } = await axios.get('/api/predictions'); setUserPreds(data); }
    catch {}
  };

  const allPreds = STATIC_PREDS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tag.toLowerCase().includes(search.toLowerCase())
  );

  const ep = STATIC_PREDS.find(p => p.num === active);

  const submitPred = async (e) => {
    e.preventDefault(); setFormErr('');
    try {
      const payload = {
        ...form,
        timeline:   form.timeline.split('\n').filter(Boolean),
        references: form.references.split('\n').filter(Boolean),
      };
      if (editId) {
        await axios.put(`/api/predictions/${editId}`, payload);
      } else {
        await axios.post('/api/predictions', payload);
      }
      setShowForm(false); setForm({ episodeNumber:'', episodeTitle:'', interpretation:'', timeline:'', references:'' }); setEditId(null);
      fetchUserPreds();
    } catch (err) { setFormErr(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ episodeNumber: p.episodeNumber, episodeTitle: p.episodeTitle, interpretation: p.interpretation, timeline: p.timeline.join('\n'), references: p.references.join('\n') });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePred = async (id) => {
    if (!window.confirm('Delete this prediction?')) return;
    try { await axios.delete(`/api/predictions/${id}`); fetchUserPreds(); }
    catch {}
  };

  return (
    <div className="page-wrapper predictions-page">
      <h1 className="section-title">Predictions Breakdown</h1>
      <div className="pred-search-wrap">
        <input className="ep-search" placeholder="Search predictions..." value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {STATIC_PREDS.filter(p => isBookmarked(p.num)).length > 0 && (
        <div className="bookmarked-preds-section">
          <h2 className="section-title" style={{textAlign:'left', fontSize:'1.5rem', marginBottom:'1rem'}}>Bookmarked Predictions</h2>
          <div className="pred-grid" style={{marginBottom: '2rem'}}>
            {STATIC_PREDS.filter(p => isBookmarked(p.num)).map(p => (
              <button key={p.num}
                className={`pred-chip ${active === p.num ? 'active' : ''}`}
                style={{ '--chip-color': p.color }}
                onClick={() => setActive(n => n === p.num ? null : p.num)}>
                <span className="chip-num">{String(p.num).padStart(2,'0')}</span>
                <span className="chip-label">{p.title}</span>
                <span className="chip-tag">{p.tag}</span>
              </button>
            ))}
          </div>
          <h2 className="section-title" style={{textAlign:'left', fontSize:'1.5rem', marginBottom:'1rem'}}>All Predictions</h2>
        </div>
      )}

      <div className="pred-grid">
        {allPreds.map(p => (
          <button key={p.num}
            className={`pred-chip ${active === p.num ? 'active' : ''}`}
            style={{ '--chip-color': p.color }}
            onClick={() => setActive(n => n === p.num ? null : p.num)}>
            <span className="chip-num">{String(p.num).padStart(2,'0')}</span>
            <span className="chip-label">{p.title}</span>
            <span className="chip-tag">{p.tag}</span>
          </button>
        ))}
      </div>

      {ep && (
        <div className="pred-panel fade-up" style={{ '--panel-color': ep.color }}>
          <div className="panel-top">
            <div>
              <span className="panel-tag" style={{ background: ep.color }}>{ep.tag}</span>
              <h2 className="panel-title">Episode {ep.num}: {ep.title}</h2>
              <p className="panel-summary">{ep.summary}</p>
            </div>
            <button
              className={`btn-sp ${isBookmarked(ep.num) ? 'btn-sp-danger' : 'btn-sp-outline'} bookmark-btn`}
              onClick={() => isBookmarked(ep.num) ? removeBookmark(ep.num) : addBookmark(ep)}>
              {isBookmarked(ep.num) ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
          <div className="panel-body">
            <section className="panel-section">
              <h3 className="ps-title">Interpretation</h3>
              <p>{ep.interpretation}</p>
            </section>
            <section className="panel-section event-box" style={{ borderColor: ep.color }}>
              <h3 className="ps-title" style={{ color: ep.color }}>Real-World Event</h3>
              <strong>{ep.realEvent.title}</strong>
              <div className="event-date">{ep.realEvent.date}</div>
              <p style={{marginTop:'0.5rem'}}>{ep.realEvent.body}</p>
            </section>
            <section className="panel-section">
              <h3 className="ps-title">Timeline of Events</h3>
              <ul className="pred-bullets">
                {ep.bullets.map((b,i) => (
                  <li key={i}><span className="bullet-dot" style={{ background: ep.color }}/>{b}</li>
                ))}
              </ul>
            </section>
            <section className="panel-section">
              <h3 className="ps-title">Visual Evidence</h3>
              <div className="pred-images">
                {ep.images.map((src,i) => (
                  <figure key={i} className="pred-figure">
                    <img src={src} alt="evidence"/>
                    <figcaption>Evidence image</figcaption>
                  </figure>
                ))}
              </div>
            </section>
            <section className="panel-section">
              <h3 className="ps-title">Source Reference</h3>
              <a href={ep.reference.url} target="_blank" rel="noopener noreferrer"
                className="ref-link" style={{ borderColor: ep.color, color: ep.color }}>
                {ep.reference.label}
              </a>
            </section>
          </div>
        </div>
      )}

      {/* User submitted predictions */}
      <div className="user-preds-section">
        <div className="up-header">
          <h2 className="section-title" style={{textAlign:'left', marginBottom:'0'}}>Community Predictions</h2>
          <button className="btn-sp btn-sp-primary" onClick={() => { setShowForm(s => !s); setEditId(null); setForm({ episodeNumber:'', episodeTitle:'', interpretation:'', timeline:'', references:'' }); }}>
            {showForm ? 'Cancel' : 'Add Prediction'}
          </button>
        </div>

        {showForm && (
          <form className="pred-form fade-up" onSubmit={submitPred}>
            <h3>{editId ? 'Edit Prediction' : 'Submit a Prediction'}</h3>
            {formErr && <div className="pred-form-err">{formErr}</div>}
            <input placeholder="Episode Number" value={form.episodeNumber} onChange={e => setForm({...form, episodeNumber: e.target.value})}/>
            <input placeholder="Episode Title" value={form.episodeTitle} onChange={e => setForm({...form, episodeTitle: e.target.value})} required/>
            <textarea placeholder="Your interpretation..." value={form.interpretation} onChange={e => setForm({...form, interpretation: e.target.value})} required rows={4}/>
            <textarea placeholder="Timeline (one event per line)" value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} rows={3}/>
            <textarea placeholder="Reference links (one per line)" value={form.references} onChange={e => setForm({...form, references: e.target.value})} rows={2}/>
            <button type="submit" className="btn-sp btn-sp-primary">{editId ? 'Save Changes' : 'Submit'}</button>
          </form>
        )}

        <div className="user-preds-list">
          {userPreds.length === 0 && <p className="no-preds">No community predictions yet. Be the first to add one.</p>}
          {userPreds.map(p => (
            <div className="user-pred-card" key={p._id}>
              <div className="upc-header">
                <div>
                  <span className="upc-ep">Episode {p.episodeNumber}</span>
                  <h4 className="upc-title">{p.episodeTitle}</h4>
                  <span className="upc-author">by {p.submittedBy?.name || 'User'}</span>
                </div>
                {(user?.id === p.submittedBy?._id || user?.role === 'admin') && (
                  <div className="upc-actions">
                    {user?.id === p.submittedBy?._id && (
                      <button className="btn-sp btn-sp-outline" style={{fontSize:'0.8rem',padding:'0.3rem 0.8rem'}} onClick={() => startEdit(p)}>Edit</button>
                    )}
                    <button className="btn-sp btn-sp-danger"  style={{fontSize:'0.8rem',padding:'0.3rem 0.8rem'}} onClick={() => deletePred(p._id)}>Delete</button>
                  </div>
                )}
              </div>
              <p className="upc-interp">{p.interpretation}</p>
              {p.timeline?.length > 0 && (
                <ul className="upc-timeline">
                  {p.timeline.map((t,i) => <li key={i}>{t}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}