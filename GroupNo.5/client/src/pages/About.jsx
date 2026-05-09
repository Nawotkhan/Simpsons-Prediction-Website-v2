import './About.css';
import imgNawaal from '../assets/nawaal.jpeg'
import imgHubba from '../assets/huba.jpeg'
import imgKhadija from '../assets/khadija.jpeg'
import imgYumna from '../assets/yumna.jpeg'

const MEMBERS = [
  { name: 'Nawaal Talat Khan', roll: '23L-5566', bio: 'Backend architecture, API routes, authentication system and database design.', img: imgNawaal },
  { name: 'Hubba Abid', roll: '23L-4029', bio: 'Frontend setup, React routing, Navbar, ThemeToggle and animated backgrounds.', img: imgHubba },
  { name: 'Yumna Asif', roll: '23L-5548', bio: 'Home page, Episodes page, character section, CSS styling and responsive design.', img: imgYumna },
  { name: 'Khadija Sajid', roll: '23L-5568', bio: 'Predictions page, Reviews page, CRUD implementation and final testing.', img: imgKhadija },
];

export default function About() {
  return (
    <div className="about-page page-wrapper">
      <h1 className="section-title">About SimPredictions</h1>
      <p className="about-desc">
        SimPredictions is a FAST NUCES Web Programming project dedicated to exploring the uncanny predictions of The Simpsons.
        Built by a group of four Financial Technology students, it documents ten notable episodes and the real-world events they foresaw.
      </p>

      <h2 className="section-title" style={{ marginTop: '3rem' }}>Meet the Team</h2>
      <div className="team-grid">
        {MEMBERS.map((m, i) => (
          <div className="team-card fade-up" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <img src={m.img} alt={m.name} className="team-img" />
            <h3 className="team-name">{m.name}</h3>
            <span className="team-roll">{m.roll}</span>
            <p className="team-bio">{m.bio}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: '3rem' }}>Find Us</h2>
      <div className="map-wrap">
        <iframe
          title="FAST NUCES Lahore"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.2!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905c526f7d5b3%3A0xcbf8b34f2f8b3344!2sFAST%20NUCES%20Lahore!5e0!3m2!1sen!2spk!4v1234567890"
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}