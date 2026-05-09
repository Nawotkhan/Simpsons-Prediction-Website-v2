import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const CHARS = [
  { name:'Homer Simpson',  role:'Fry cook, lovable dad',       img:'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png' },
  { name:'Marge Simpson',  role:'Patient blue-haired matriarch',img:'https://upload.wikimedia.org/wikipedia/en/0/0b/Marge_Simpson.png' },
  { name:'Bart Simpson',   role:'Mischievous skateboarding son',img:'https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png' },
  { name:'Lisa Simpson',   role:'Intellectual saxophone player',img:'https://upload.wikimedia.org/wikipedia/en/e/ec/Lisa_Simpson.png' },
  { name:'Maggie Simpson', role:'Silent always-watching baby',  img:'https://upload.wikimedia.org/wikipedia/en/9/9d/Maggie_Simpson.png' },
  { name:'Mr. Burns',      role:'Sinister all-powerful billionaire',img:'https://upload.wikimedia.org/wikipedia/en/5/56/Mr_Burns.png' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-text fade-up">
          <h1 className="hero-title">The Simpsons<br/>Predicted It.</h1>
          <p className="hero-sub">
            Since 1989, The Simpsons has quietly slipped prophecies into its episodes.
            SimPredictions decodes those signals and shows you the moments that came true.
          </p>
          <div className="hero-btns">
            <Link to="/episodes"    className="btn-sp btn-sp-primary">Browse Episodes</Link>
            <Link to="/predictions" className="btn-sp btn-sp-outline">See Predictions</Link>
          </div>
        </div>
        <div className="hero-visual fade-up">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/The_Simpsons_yellow_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" alt="Simpsons Logo" className="hero-logo"/>
          <img src="https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png" alt="Homer" className="hero-homer"/>
        </div>
      </section>

      <section className="about-section page-wrapper">
        <h2 className="section-title">What Is The Simpsons?</h2>
        <div className="about-grid">
          <div>
            <p>The Simpsons is an American animated sitcom created by Matt Groening, premiering on Fox in 1989. It follows the dysfunctional Simpson family in the fictional town of Springfield. With over 35 seasons it is the longest-running American animated series and primetime scripted television series in history.</p>
            <p style={{marginTop:'1rem'}}>SimPredictions documents ten key episodes containing predictions that later came true, presenting each one with detailed analysis, visual evidence, dated timelines and reference links.</p>
          </div>
          <div className="about-imgs">
            <img src="https://sm.ign.com/t/ign_in/news/u/update-new/update-new-disney-website-banner-shows-the-simpsons-deadpool_zhw6.1200.jpg" alt="Simpsons Cast" className="about-img"/>
          </div>
        </div>
      </section>

      <section className="chars-section page-wrapper">
        <h2 className="section-title">Meet the Characters</h2>
        <div className="chars-grid">
          {CHARS.map((c,i) => (
            <div className="char-card fade-up" key={i} style={{animationDelay:`${i*0.08}s`}}>
              <img src={c.img} alt={c.name} className="char-img"/>
              <h4>{c.name}</h4>
              <p>{c.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}