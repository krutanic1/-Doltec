
function Step({ icon, title, description }) {
  return (
    <div className="step">
      <div className="step-icon">{icon}</div>
      <div>
        <h3 className="step-title">{title}</h3>
        <p className="step-description">{description}</p>
      </div>
    </div>
  );
}

// Simple inline SVG icons
const Icons = {
  GraduationCap: (
    <svg className="icon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeWidth="2" d="M12 14v7m0-7l-9-5m9 5l9-5" />
    </svg>
  ),
  UserPlus: (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" strokeWidth="2" />
      <path strokeWidth="2" d="M20 8v6m-3-3h6" />
    </svg>
  ),
  Send: (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" d="M22 2L11 13" />
      <path strokeWidth="2" d="M22 2L15 22l-4-9-9-4L22 2z" />
    </svg>
  ),
  FileCheck2: (
    <svg className="icon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" d="M9 11l3 3L22 4" />
      <path strokeWidth="2" d="M21 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7" />
    </svg>
  ),
  Sparkles: (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3z" />
      <path strokeWidth="2" d="M19 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  ),
  CalendarClock: (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
      <path strokeWidth="2" d="M16 2v4M8 2v4m-5 4h18" />
      <circle cx="12" cy="14" r="4" strokeWidth="2" />
      <path strokeWidth="2" d="M12 12v2l1 1" />
    </svg>
  ),
};

export default function HowItWorks() {
  return (
    <div id="howitworks_landingpage">
         <section id="how-it-works" aria-labelledby="how-title" className="how">
      <div className="how-container">
        <h2 id="how-title" className="how-title">
          How it works
        </h2>
        <p className="how-subtitle">
          Two simple tracks, one powerful platform.
        </p>

        <div className="how-grid">
          {/* Students */}
          <div className="how-card">
            <div className="how-card-header">
              {Icons.GraduationCap}
              <h3 className="how-card-title">Students</h3>
            </div>
            <div className="how-steps">
              <Step
                icon={Icons.UserPlus}
                title="Create profile"
                description="Showcase your skills, projects, and interests."
              />
              <Step
                icon={Icons.Sparkles}
                title="Get matched"
                description="Receive roles that fit your skills and goals."
              />
              <Step
                icon={Icons.Send}
                title="Apply with one click"
                description="Fast applications with your unified profile."
              />
            </div>
          </div>

          {/* Companies */}
          <div className="how-card">
            <div className="how-card-header">
              {Icons.FileCheck2}
              <h3 className="how-card-title">Companies</h3>
            </div>
            <div className="how-steps">
              <Step
                icon={Icons.Send}
                title="Post role"
                description="Share your internship or junior position in minutes."
              />
              <Step
                icon={Icons.Sparkles}
                title="Smart matches"
                description="See ranked candidates based on required skills."
              />
              <Step
                icon={Icons.CalendarClock}
                title="Schedule & hire"
                description="Built-in scheduling and messaging to move fast."
              />
            </div>
          </div>
        </div>
      </div>
         </section>
    </div>
  );
}
