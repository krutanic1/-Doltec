const PrivacyPolicy = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0f172a", fontFamily: "'Inter', sans-serif", padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#000000", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            At <strong>Doltec</strong> (“Company”, “Platform”, “we”, “our”, “us”), your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website (<a href="https://www.doltec.in" style={{ color: "#2563eb", textDecoration: "none" }}>www.doltec.in</a>) and services.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "16px", lineHeight: "1.7", color: "#334155" }}>
          
          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>1. Information We Collect</h2>
            <p style={{ marginBottom: "8px" }}><strong style={{ color: "#000000" }}>For Candidates:</strong> Name, contact details, resume, qualifications, work experience, and application history.</p>
            <p style={{ marginBottom: "8px" }}><strong style={{ color: "#000000" }}>For Employers:</strong> Business name, contact information, job postings, and billing details.</p>
            <p><strong style={{ color: "#000000" }}>Automatically Collected Data:</strong> IP address, browser type, device details, and usage patterns via cookies, analytics tools, and log files.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>2. How We Use Your Information</h2>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>To facilitate recruitment between candidates and employers.</li>
              <li>To personalize and enhance the platform experience.</li>
              <li>To send important updates, security alerts, and promotional offers.</li>
              <li>To improve website performance, security, and features.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>3. Sharing of Information</h2>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Candidate data is shared only with employers where the candidate has applied.</li>
              <li>Employer information is disclosed only as necessary for recruitment activities.</li>
              <li>Third-party service providers (e.g., payment processors, hosting services) may access limited data as required to deliver services.</li>
              <li>Doltec does not sell, rent, or trade personal information to unauthorized third parties.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>4. Cookies & Tracking Technologies</h2>
            <p>Doltec uses cookies, pixels, and similar tracking technologies to improve website performance, remember user preferences, and deliver relevant content. Users may disable cookies in their browser settings, but certain features may not function properly.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>5. Data Security</h2>
            <p>We use industry-standard encryption, firewalls, and secure servers to protect your personal data. However, no digital system is 100% secure, and Doltec cannot guarantee absolute security. Users are encouraged to protect their own accounts with strong passwords.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>6. Data Retention</h2>
            <p>We retain candidate and employer data as long as accounts remain active or as required to comply with legal obligations. Inactive accounts may have their data archived or deleted after a reasonable period.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>7. User Rights</h2>
            <p>Users have the right to access, update, correct, or request deletion of their personal data. Requests can be made at <a href="mailto:support@doltec.in" style={{ color: "#2563eb", textDecoration: "none" }}>support@doltec.in</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>8. Third-Party Services</h2>
            <p>Doltec may integrate with trusted third-party vendors such as payment gateways, analytics providers, or hosting services. These providers operate under their own privacy policies and Doltec is not responsible for their practices.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>9. International Users</h2>
            <p>If you access Doltec from outside India, your data may be transferred, stored, and processed in India. By using our platform, you consent to such transfers in compliance with applicable data laws.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>10. Children’s Privacy</h2>
            <p>Doltec is not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors. If we become aware that a minor has submitted data, it will be deleted promptly.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>11. Changes to Privacy Policy</h2>
            <p>Doltec reserves the right to update this policy at any time. Significant changes will be communicated via email or platform notifications. Continued use of Doltec constitutes acceptance of the updated policy.</p>
          </section>

          <section style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>12. Contact & Grievance Officer</h2>
            <p style={{ margin: 0 }}>
              For privacy-related concerns or complaints, please contact our Grievance Officer: <br />
              <strong style={{ color: "#000000" }}>Email:</strong> <a href="mailto:support@doltec.in" style={{ color: "#2563eb", textDecoration: "none" }}>support@doltec.in</a> <br />
              <strong style={{ color: "#000000" }}>Address:</strong> Doltec Pvt. Ltd., Bangalore, India
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
