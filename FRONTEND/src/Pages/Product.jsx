import {Link} from 'react-router-dom';
const products = [
  {
    title: 'Job Post Engine',
    icon: '🧰',
    description: 'Create and manage job listings across multiple role categories.',
  },
  {
    title: 'Candidate Tracker',
    icon: '📋',
    description: 'Track, organize, and manage candidates through hiring lifecycle stages.',
  },
  {
    title: 'Interview Manager',
    icon: '📅',
    description: 'Schedule interviews, integrate video, and score candidate evaluations.',
  },
  {
    title: 'Resume Analyzer',
    icon: '🧠',
    description: 'Parse resumes using AI to match skills with roles.',
  },
  {
    title: 'Hiring Insights',
    icon: '📈',
    description: 'Gain visual reports on pipeline, metrics, and team performance.',
  },
  {
    title: 'Offer Manager',
    icon: '✉️',
    description: 'Send, manage, and track digital offer letters with ease.',
  },
];


const Products = () => {
  return (
    <div id="products">

      <section className="products-intro">
         <div className="product__content">
             <h2>Powerful Recruitment Products, One Unified Platform</h2>
             <p>From job posting to final offer—explore the modular tools that make Doltec a complete talent acquisition solution.</p>
             <button><Link to="/ContactUs">Get Started</Link></button>
         </div>
      </section>

      <section className="product-features">
        <h2>Core Product Modules</h2>
         <div className="product-grid">
           {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="icon">{product.icon}</div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>
        ))}
         </div>
      </section>

      <section className='plate__form__benift'>
         <h2>Why Doltec Products Stand Out</h2>
         <div className="benift__container">
          <div className="benift__card">
            <h3>All-in-One Ecosystem</h3>
            <p>Everything you need to manage recruitment—no switching tabs.</p>
          </div>
          <div className="benift__card">
            <h3>Cloud-Based and Secure</h3>
            <p>GDPR-compliant and encrypted data handling across modules.</p>
          </div>
          <div className="benift__card">
            <h3>Role-Based Access</h3>
            <p>Configurable permissions for recruiters, managers, and admins.</p>
          </div>
         </div>
      </section>

      <section className="hiring__needs">
        <h2>Built for Every Hiring Need</h2>
        <p>Whether you're a fast-scaling startup or an enterprise HR team, Doltec adapts to your workflow</p>
        <div className='hiring__container'>
          <div className="overlayer">
             <div className='hiring__card'>
              <h3><i className="fa fa-lightbulb-o text-yellow-300"></i> Recruitment Agencies</h3>
            <h3><i className="fa fa-lightbulb-o text-yellow-300"></i> Corporate HR Teams</h3>
            <h3><i className="fa fa-lightbulb-o text-yellow-300"></i> Startups & SMEs</h3>
            <h3><i className="fa fa-lightbulb-o text-yellow-300"></i> Educational Institutions</h3>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
