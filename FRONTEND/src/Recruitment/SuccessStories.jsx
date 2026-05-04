
function Quote({ quote, name, title, avatarAlt }) {
  return (
    <figure className="quote-card">
      <blockquote className="quote-text">“{quote}”</blockquote>
      <figcaption className="quote-author">
        <img
          src="https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg"
          alt={avatarAlt}
          className="quote-avatar"
        />
        <div>
          <div className="author-name">{name}</div>
          <div className="author-title">{title}</div>
        </div>
      </figcaption>
    </figure>
  );
}

function KPI({ value, label }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

export default function SuccessStories() {
  return (
    <div id="successStories_landingpage">
         <section className="success-section" aria-labelledby="success-title">
      <div className="success-container">
        <h2 id="success-title" className="success-title">
          Success stories
        </h2>
        <p className="success-desc">
          Real outcomes from students and companies using our platform.
        </p>

        {/* Quotes */}
        {/* <div className="quote-grid">
          <Quote
            quote="I created one profile and got matched with three internships within a week."
            name="Ava Johnson"
            title="Computer Science, State University"
            avatarAlt="Portrait of Ava Johnson"
          />
          <Quote
            quote="Our time-to-hire for interns dropped by half—the matches were spot on."
            name="Daniel Lee"
            title="Recruiter, Acme Corp"
            avatarAlt="Portrait of Daniel Lee"
          />
        </div> */}

        {/* KPIs */}
        <div className="kpi-grid">
          <KPI value="8,000+" label="Matches made" />
          <KPI value="2x" label="Faster time-to-hire" />
          <KPI value="95%" label="Satisfaction rating" />
        </div>
      </div>
    </section>
    </div>
  );
}
