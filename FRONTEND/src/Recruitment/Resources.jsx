
import { Link } from "react-router-dom";

const articles = [
  {
    title: "How to build a standout student profile",
    excerpt: "Craft a portfolio that showcases projects, skills, and potential.",
    tag: "Student Tips",
    seen: 1200
  },
  {
    title: "Hiring playbook for early-career talent",
    excerpt: "Best practices to assess skills and potential beyond resumes.",
    tag: "Hiring Playbook",
    seen: 750
  },
  {
    title: "Ace your first interview",
    excerpt: "Structured prep to reduce nerves and highlight your strengths.",
    tag: "Student Tips",
    seen: 1500
  },
  {
    title: "Structured interviews that work",
    excerpt: "Create consistent, fair processes that produce better hires.",
    tag: "Hiring Playbook",
    seen: 1000
  },
];

export default function Resources() {
  return (
     <div id="resources_landingpage">
         <section id="resources" className="resources">
            <div className="resources-container">
        <div className="resources-header">
          <div>
            <h2 className="resources-title">Resources & career tips</h2>
            <p className="resources-subtitle">
              Guides for students and employers to succeed.
            </p>
          </div>
          <Link to="/Resources" className="resources-link desktop-only">
            Explore all resources
          </Link>
        </div>

        <div className="resources-grid">
          {articles.map((a) => (
            <article key={a.title} className="resource-card">
               <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem"}}>
                <h3 className="resource-title">{a.title}</h3>
               <Link to="/Resources" className="resource-readmore" aria-label={`Read more: ${a.title}`}>
               <i class="fa fa-arrow-right" aria-hidden="true"></i>
              </Link>
               </div>
              <div className="resource-tag">{a.tag}</div>
              <p className="resource-excerpt">{a.excerpt}</p>
              {/* <span><i class="fa fa-eye" aria-hidden="true"></i> {a.seen}</span> */}
             
            </article>
          ))}
        </div>

        <div className="mobile-only" style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/Resources" className="resources-link">
            Explore all resources
          </Link>
        </div>
            </div>
         </section>
     </div>
  );
}
