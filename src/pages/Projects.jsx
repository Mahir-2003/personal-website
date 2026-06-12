import { Canvas } from '@react-three/fiber';
import Starfield from '../components/Starfield';

const BADGE_CLASS = {
  'Completed':     'lcars-badge lcars-badge--completed',
  'Active':        'lcars-badge lcars-badge--active',
  'In Development':'lcars-badge lcars-badge--development',
};

const STATUS_SLUG = {
  'Completed':      'completed',
  'Active':         'active',
  'In Development': 'development',
};

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "Turismo Telemetry",
      description: ["Real-time racing telemetry visualization dashboard for Gran Turismo 7", "Live telemetry streaming, 60fps data visualization, and sub-100ms latency"],
      technologies: ["TypeScript", "React", "TailwindCSS", "Python", "FastAPI", "WebSocket", "Pydantic", "Recharts", "Salsa20"],
      status: "In Development",
      link: "https://github.com/Mahir-2003/turismo-telemetry"
    },
    {
      id: 2,
      name: "Personal Portfolio",
      description: ["The website you're on :)"],
      technologies: ["React", "Three.js", "TailwindCSS", "Vite", "React Router", "Spotify API", "RSS Parsing", "JavaScript"],
      status: "In Development",
      link: "https://github.com/Mahir-2003/personal-website"
    },
    {
      id: 3,
      name: "Toodaloo Mobile App",
      description: ["Find public bathrooms with geolocation, reviews, and accessibility filters", "60,000+ locations with AI-powered summaries"],
      technologies: ["React Native", "Firebase", "JavaScript", "RapidAPI", "Google Gemini API", "Geolocation Services"],
      status: "Completed",
      link: "https://github.com/Mahir-2003/toodaloo-app"
    },
    {
      id: 4,
      name: "Mortgage Master",
      description: ["3rd place Badger Blockchain hackathon winner", "Smart contract loan platform with MetaMask integration and secure disbursement"],
      technologies: ["React", "Solidity", "HTML/CSS", "Hardhat", "MetaMask", "Web3"],
      status: "Completed",
      link: "https://github.com/dgopinath3693/Mortgage-Master"
    },
    {
      id: 5,
      name: "Nyla - Parental Education App",
      description: ["Duolingo-style parenting education with interactive modules", "Community forum for parent discussions and advice sharing"],
      technologies: ["React Native", "Firebase", "JavaScript", "Google Cloud"],
      status: "Completed",
      link: "https://github.com/Mahir-2003/nyla-frontend"
    },
    {
      id: 6,
      name: "CS 220 Queue Monitor",
      description: ["Automated help queue monitoring for CS 220", "Google Sheets integration with macOS notifications"],
      technologies: ["Python", "Google Sheets API", "AppleScript", "GCP"],
      status: "Completed",
      link: "https://github.com/Mahir-2003/cs220-queue-monitor",
    },
  ];

  return (
    <>
      {/* Fixed infinite starfield background */}
      <div className="fixed inset-0 w-screen h-screen -z-20 overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 50], fov: 60, near: 0.1, far: 1000 }}
          className="bg-black"
        >
          <Starfield />
        </Canvas>
      </div>

      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page header — matches Home.jsx section header style */}
          <h1 className="text-4xl font-bold text-orange-400 mb-2">
            [ PROJECT ARCHIVE ]
          </h1>
          <p className="career-timeline-meta">STARFLEET PROJECT DATABASE // {projects.length} RECORDS</p>
          <div className="career-timeline-strip" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>

          <p className="mt-8 mb-10 text-lg" style={{ color: 'var(--lcars-text)' }}>
            Take a look at some of the projects I've worked on!
          </p>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <article key={project.id} className={`lcars-project-card lcars-project-card--${STATUS_SLUG[project.status] ?? 'development'}`}>
                <div className="lcars-project-card-body">
                  {/* Header: name + status badge */}
                  <div className="career-card-header">
                    <p className="career-card-company">{project.name}</p>
                    <span className={BADGE_CLASS[project.status] ?? 'lcars-badge lcars-badge--development'}>
                      {project.status}
                    </span>
                  </div>

                  <div className="career-card-divider" aria-hidden="true" />

                  {/* Description */}
                  <ul className="career-card-desc mb-4">
                    {project.description.map((point, i) => (
                      <li key={i}>
                        <span className="career-chevron" aria-hidden="true">▶</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack — mt-auto pins this + button to the card bottom */}
                  <div className="mt-auto mb-4">
                    <p className="lcars-section-label">Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map(tech => (
                        <span key={tech} className="lcars-tag">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lcars-action-btn"
                  >
                    EXPLORE PROJECT
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Mission log note */}
          <div className="mt-12 lcars-note-block">
            <p style={{ color: 'var(--lcars-text)' }}>
              <span style={{ color: 'var(--lcars-orange)', fontWeight: 700 }}>MISSION LOG:</span>{' '}
              More projects are being catalogued and will be added to this archive as they complete their
              respective development cycles.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
