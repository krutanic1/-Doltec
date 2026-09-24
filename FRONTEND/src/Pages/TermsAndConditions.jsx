import { Link } from 'react-router-dom';
export default function TermsAndConditions() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0f172a", fontFamily: "'Inter', sans-serif", padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#000000", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
            Terms & Conditions
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Welcome to <strong>Doltec</strong> (“Company”, “Platform”, “we”, “our”, “us”). By accessing or using our website (<a href="https://www.doltec.in" style={{ color: "#2563eb", textDecoration: "none" }}>www.doltec.in</a>) and services, you agree to comply with the following Terms & Conditions. These terms outline the obligations, rights, and responsibilities of both employers and candidates on the Doltec platform. Please read them carefully.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "16px", lineHeight: "1.7", color: "#334155" }}>
          
          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>1. Use of Platform</h2>
            <p>Doltec provides a digital recruitment platform connecting employers with potential candidates. Users must provide accurate, updated, and complete information at all times. Any fraudulent activity, creation of fake profiles, posting of misleading jobs, or misuse of platform features is strictly prohibited and may result in account suspension or legal action.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>2. Account Responsibility</h2>
            <p>You are solely responsible for safeguarding your login credentials and all activities under your account. Doltec shall not be liable for any unauthorized use or data breach caused by negligence on your part. We recommend enabling strong passwords and keeping credentials private.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>3. Services for Employers</h2>
            <p>Employers may post job openings, review candidate applications, and use premium services. Employers agree not to post jobs that are misleading, unlawful, discriminatory, or offensive. Doltec reserves the right to remove content that violates applicable laws or community guidelines.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>4. Services for Candidates</h2>
            <p>Candidates may create profiles, upload resumes, and apply for jobs. Doltec does not guarantee interviews, job offers, or employment. All final decisions rest with the employer. Candidates must ensure that resumes and application information are truthful and accurate.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>5. Payments</h2>
            <p>Employers may access premium features through subscription or one-time payments. Payments are processed securely via trusted payment gateways. All payments are final and non-refundable, unless specifically mentioned in our <strong>Refund Policy</strong>.</p>
          </section>

          <section style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>➡ Our Terms in Simple Words</h2>
            <p style={{ marginBottom: "12px" }}>We believe in transparency. Here’s a quick summary of our terms:</p>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
              <li>✅ Use Doltec honestly and responsibly.</li>
              <li>✅ Employers must post only genuine job opportunities.</li>
              <li>✅ Candidates should provide truthful resumes and applications.</li>
              <li>✅ Payments made for premium services are generally non-refundable.</li>
              <li>✅ Doltec is a platform only — we don’t guarantee hiring results.</li>
              <li>✅ Misuse of the platform can result in suspension or termination.</li>
            </ul>
            <p style={{ marginTop: "12px", fontStyle: "italic", fontSize: "14px", color: "#64748b" }}>These highlights are for your convenience. Please read the full Terms & Conditions for complete details.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>6. Intellectual Property</h2>
            <p>All trademarks, branding, content, designs, and software on Doltec are the intellectual property of the company. Users are prohibited from copying, distributing, or creating derivative works without written permission from Doltec.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>7. Data Protection</h2>
            <p>Doltec is committed to protecting user data. Personal information collected will be processed in compliance with applicable data protection laws and as per our <Link to="/privacypolicy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>8. Limitation of Liability</h2>
            <p>Doltec serves as a technology intermediary and does not participate in hiring decisions. We do not guarantee the accuracy of user content or job listings. Doltec will not be responsible for financial losses, missed opportunities, or disputes between employers and candidates.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>9. Termination of Access</h2>
            <p>Doltec reserves the right to suspend, restrict, or terminate accounts that violate these terms. Such action may be taken without prior notice if the violation poses a risk to platform integrity or user trust.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>10. Governing Law</h2>
            <p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, India.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>11. Dispute Resolution</h2>
            <p>Any disputes arising shall first be attempted to be resolved amicably. If unresolved, disputes will be referred to arbitration in Bangalore, in accordance with the Arbitration and Conciliation Act, 1996.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>12. Amendments</h2>
            <p>Doltec reserves the right to amend or update these Terms at any time. Users are encouraged to review this page periodically. Continued use of the platform after updates signifies acceptance of the revised terms.</p>
          </section>

          <section style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>13. Contact Us</h2>
            <p style={{ margin: 0 }}>
              For questions, please contact us at: <br />
              <strong style={{ color: "#000000" }}>Email:</strong> <a href="mailto:support@doltec.in" style={{ color: "#2563eb", textDecoration: "none" }}>support@doltec.in</a> <br />
              <strong style={{ color: "#000000" }}>Address:</strong> Doltec Pvt. Ltd., Bangalore, India
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
