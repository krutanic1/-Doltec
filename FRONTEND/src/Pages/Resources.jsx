import React, { useState } from "react";
import { Link } from "react-router-dom";

const allArticles = [
  {
    title: "How to build a standout student profile",
    excerpt: "Craft a portfolio that showcases projects, skills, and potential.",
    fullContent: `
Building a strong student profile starts with showcasing your achievements, projects, and internships. Include GitHub links, open-source contributions, certifications, and practical skills.

💡 **Pro Tip**: Keep it consistent and visually appealing. Recruiters love clarity and concise content.

Use platforms like LinkedIn, GitHub, and Behance to publish your work. Highlight measurable impact and numbers wherever possible.

📌 **Extra Tips**:
- Keep an updated resume aligned with your online profiles.
- Add testimonials from mentors or peers for credibility.
- Create a short intro video explaining who you are and your aspirations — this stands out.
    `,
    tag: "Student Tips",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Hiring playbook for early-career talent",
    excerpt: "Best practices to assess skills and potential beyond resumes.",
    fullContent: `
Hiring early-career talent requires a structured approach. Move beyond resumes and evaluate problem-solving, teamwork, and learning agility.

💡 **Pro Tip**: Use skills-based assessments, technical challenges, and structured interviews to find the best matches.

Create an internal playbook to ensure every hiring manager follows consistent processes to reduce bias.

📌 **Extra Tips**:
- Offer internships or trial projects to evaluate fit.
- Use collaborative tasks to see communication skills in action.
- Implement mentorship programs to improve retention.
    `,
    tag: "Hiring Playbook",
    image:
      "https://i.pinimg.com/1200x/92/69/30/926930891da2efb7a7314a5a176890c8.jpg",
  },
  {
    title: "Ace your first interview",
    excerpt:
      "Structured prep to reduce nerves and highlight your strengths — from common questions to behavioral answers.",
    fullContent: `
Your first interview sets the tone for your career. Research the company, rehearse common behavioral questions, and prepare STAR-method answers.

💡 **Pro Tip**: Focus on achievements, numbers, and impact. Build confidence by mock interviews with friends or mentors.

Dress professionally, arrive early, and communicate clearly. Always ask insightful questions at the end.

📌 **Extra Tips**:
- Prepare a 30-second personal pitch about yourself.
- Practice non-verbal cues like eye contact and posture.
- Bring a notepad to jot down key points or follow-up tasks.
    `,
    tag: "Student Tips",
    image:
      "https://i.pinimg.com/1200x/6b/64/37/6b643743197da02ae6b64bbaa8a784c8.jpg",
  },
  {
    title: "Structured interviews that work",
    excerpt:
      "Create consistent, fair processes that produce better hires and improve candidate experience.",
    fullContent: `
Structured interviews improve fairness and predictive accuracy. Prepare a question bank aligned with job requirements and scorecards.

💡 **Pro Tip**: Train interviewers on evaluation rubrics and unconscious bias.

Review and iterate after each hiring cycle to continuously improve outcomes and reduce time-to-hire.

📌 **Extra Tips**:
- Combine behavioral and technical questions to see both soft and hard skills.
- Provide candidates a clear roadmap of the interview process.
- Use scoring sheets to reduce subjectivity.
    `,
    tag: "Hiring Playbook",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Networking for long-term career growth",
    excerpt:
      "Building authentic connections that open doors beyond job boards.",
    fullContent: `
Networking is more than collecting LinkedIn connections — it’s about building relationships that last. Start by engaging in communities, attending webinars, and contributing to discussions.

💡 **Pro Tip**: Focus on giving before asking. Share valuable content or insights to establish credibility.

📌 **Extra Tips**:
- Attend industry-specific meetups and virtual conferences.
- Follow up with people you meet within 48 hours — a simple thank-you note works wonders.
- Keep a running list of your connections with notes on where you met and what you discussed.
    `,
    tag: "Student Tips",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Onboarding new hires effectively",
    excerpt:
      "Why a strong onboarding experience drives retention and productivity.",
    fullContent: `
Onboarding sets the tone for an employee’s experience. A well-structured onboarding program accelerates ramp-up time and builds engagement.

💡 **Pro Tip**: Create a 30-60-90 day plan for new hires to clarify expectations.

📌 **Extra Tips**:
- Provide a welcome kit and pre-boarding resources before Day 1.
- Assign a buddy or mentor for the first three months.
- Gather feedback after onboarding to improve future experiences.
    `,
    tag: "Hiring Playbook",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Personal branding for job seekers",
    excerpt:
      "Position yourself as a go-to expert through your digital footprint.",
    fullContent: `
Personal branding is your reputation at scale. Showcase your strengths, values, and expertise consistently across platforms.

💡 **Pro Tip**: Share insights, not just achievements. Educate your audience with value-driven posts.

📌 **Extra Tips**:
- Maintain a clean, professional presence on all social media.
- Publish blogs or short articles on LinkedIn.
- Use a consistent color palette and tone for your personal website or portfolio.
    `,
    tag: "Student Tips",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
];


export default function Resources() {
  const [filter, setFilter] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null); // for modal

  const tags = ["All", ...new Set(allArticles.map((a) => a.tag))];

  const articles =
    filter === "All"
      ? allArticles
      : allArticles.filter((a) => a.tag === filter);

  return (
    <div id="resources_page">
      <div className="resources-page">
        {/* Hero Banner */}
        <section className="resources-hero">
          <h1>Resources & Career Tips</h1>
          <p>
            Practical guides for students to stand out and for employers to hire
            smarter.
          </p>
        </section>

        {/* Filters */}
        <div className="resources-filters">
          {tags.map((t) => (
            <button
              key={t}
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <section className="resources-grid">
          {articles.map((a) => (
            <article key={a.title} className="resource-card">
              <div className="resource-image">
                <img src={a.image} alt={a.title} />
              </div>
              <div className="resource-content">
                <span className="resource-tag">{a.tag}</span>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <button
                  className="read-more"
                  onClick={() => setSelectedArticle(a)}
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Modal Dialog */}
        {selectedArticle && (
          <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedArticle(null)}
              >
                ×
              </button>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="modal-image"
              />
              <h2>{selectedArticle.title}</h2>
              <div className="modal-body">
                <p>{selectedArticle.fullContent}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <section className="resources-cta">
          <h2>Get started with Doltec</h2>
          <p>
            Students create profiles for free. Companies can post jobs and hire
            with ease.
          </p>
          <div className="cta-buttons">
            <Link to="/StudentLogIn" className="btn student-btn">
              For Students
            </Link>
            <Link to="/Companylogin" className="btn company-btn">
              For Companies
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
