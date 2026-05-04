
const features = [
  {
    icon: "✨",
    title: "Skills-based matching",
    desc: "Better recommendations using projects, skills, and interests.",
  },
  {
    icon: "👥",
    title: "Team collaboration",
    desc: "Hiring teams can shortlist, comment, and tag candidates.",
  },
  {
    icon: "📅",
    title: "Built-in scheduling",
    desc: "Coordinate interviews with integrated scheduling tools.",
  },
  {
    icon: "🛡️",
    title: "Privacy controls",
    desc: "You decide what to share; controls for both students and recruiters.",
  },
];

export default function PlatformFeatures() {
  return (
    <div id="platformFeatures_landingpage">
        <section id="features" className="features-section">
      <div className="features-container">
        <h2 id="features-title" className="features-title">
          Smart matching & features
        </h2>
        <p className="features-subtitle">
          Tools that help students shine and help companies move faster.
        </p>

        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-header">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-heading">{f.title}</h3>
              </div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
