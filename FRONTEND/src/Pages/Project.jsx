import {Link} from 'react-router-dom';

const Projects = () => {
  return (
   <div id="project">
      
      <section className="project__hero">
         <div className="project__content">
           <h2>Transforming Recruitment, One Project at a Time</h2>
           <p>At Doltec, we don’t just facilitate hiring—we engineer outcomes. Our projects are strategic interventions designed to streamline the end-to-end recruitment ecosystem. From AI-powered applicant matching to enterprise-scale talent acquisition pipelines, our portfolio reflects cutting-edge execution, domain adaptability, and tangible results.</p>
         </div>
      </section>

      <section className="our__reach">
        <h2>Our Reach</h2>
        <div className="react__container">
          <div className="react__card">
            <h3>50+</h3>
            <p>Companies Engaged</p>
          </div>
          <div className="react__card">
            <h3>20,000+</h3>
            <p>Job Seekers Empowered</p>
          </div>
          <div className="react__card">
            <h3>100+</h3>
            <p>Institutions Integrated</p>
          </div>
          <div className="react__card">
            <h3>12+</h3>
            <p>Across Industry Verticals</p>
          </div>
        </div>
      </section>

      <section className="innovation__drive">
        <h2>Outcome-Focused</h2>
        <div className="innovation__content">
          <p> Each project is a testament to Doltec’s commitment to delivering frictionless hiring experiences. We don’t believe in one-size-fits-all—we believe in architecting talent pipelines that scale with your business.</p>
        </div>
      </section>

      <section className="cta">
         <h2> Want to Partner With Us?</h2>
         <p>Explore how Doltec can reimagine your hiring workflows.</p>
         <div>
              Contact us: <a href="mailto:support@doltec.in">support@doltec.in</a> | 🤝 <Link to="/ContactUs">Get in Touch</Link>
         </div>
      </section>

   </div>
  );
}

export default Projects;
