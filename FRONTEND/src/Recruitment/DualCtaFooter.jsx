
export default function DualCtaFooter() {
  return (
    <div id="footer_landingpage">
         <footer className="footer">
      {/* Dual CTA */}
      <section aria-labelledby="cta-title" className="cta-section">
        <div className="container">
          <h2 id="cta-title" className="cta-title">
            Get started today
          </h2>
          <p className="cta-subtext">
            It’s free for students. Companies can post per job or choose a hiring plan.
          </p>

          <div className="cta-grid">
            {/* Students CTA */}
            <div className="cta-card">
              <h3 className="cta-card-title">Students</h3>
              <p className="cta-card-text">Create your free profile and start matching.</p>
              <div className="cta-btn-wrap">
                <button className="btn btn-blue">Create your free profile</button>
              </div>
            </div>
            {/* Companies CTA */}
            <div className="cta-card">
              <h3 className="cta-card-title">Companies</h3>
              <p className="cta-card-text">Post your first role and see matched candidates.</p>
              <div className="cta-btn-wrap">
                <button className="btn btn-green">Post your first job</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site map */}
      {/* <div className="footer-sitemap">
        <div className="container">
          <div className="footer-grid">
            <FooterCol title="Product" links={["How it works", "Features", "Pricing"]} />
            <FooterCol title="For Students" links={["Browse", "Profile Builder", "Resources"]} />
            <FooterCol title="For Companies" links={["Post a Job", "Talent Search", "Case Studies"]} />
            <FooterCol title="Resources" links={["Blog", "Guides", "Help Center"]} />
            <FooterCol title="Legal" links={["Privacy", "Terms", "Cookie Policy"]} />
            <FooterCol title="Social" links={["LinkedIn", "Twitter/X", "YouTube"]} />
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} TalentBridge. All rights reserved.
          </div>
        </div>
      </div> */}
    </footer>
    </div>
  );
}

// function FooterCol({ title, links }) {
//   return (
//     <div>
//       <h4 className="footer-col-title">{title}</h4>
//       <ul className="footer-links">
//         {links.map((l) => (
//           <li key={l}>
//             <a href="#" className="footer-link">
//               {l}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
