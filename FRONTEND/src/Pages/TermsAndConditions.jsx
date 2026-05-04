import { Link } from 'react-router-dom';
export default function TermsAndConditions() {
  return (
    <div id="tandc">
        <div className="tandc-page">
      <div className="tandc-header">
        <h1>Terms &amp; Conditions</h1>
        {/* <p>Effective Date: August 20, 2025</p> */}
      </div>

      <div className="tandc-content">
        <p>
          Welcome to <strong>Doltec</strong> (“Company”, “Platform”, “we”, “our”, “us”). 
          By accessing or using our website (<a href="https://www.doltec.in">www.doltec.in</a>) 
          and services, you agree to comply with the following Terms &amp; Conditions. 
          These terms outline the obligations, rights, and responsibilities of both 
          employers and candidates on the Doltec platform. Please read them carefully.
        </p>

        <h2>1. Use of Platform</h2>
        <p>
          Doltec provides a digital recruitment platform connecting employers with 
          potential candidates. Users must provide accurate, updated, and complete 
          information at all times. Any fraudulent activity, creation of fake profiles, 
          posting of misleading jobs, or misuse of platform features is strictly prohibited 
          and may result in account suspension or legal action.
        </p>
   
        <h2>2. Account Responsibility</h2>
        <p>
          You are solely responsible for safeguarding your login credentials and 
          all activities under your account. Doltec shall not be liable for any 
          unauthorized use or data breach caused by negligence on your part. 
          We recommend enabling strong passwords and keeping credentials private.
        </p>

        <h2>3. Services for Employers</h2>
        <p>
          Employers may post job openings, review candidate applications, and 
          use premium services. Employers agree not to post jobs that are misleading, 
          unlawful, discriminatory, or offensive. Doltec reserves the right to 
          remove content that violates applicable laws or community guidelines.
        </p>

        <h2>4. Services for Candidates</h2>
        <p>
          Candidates may create profiles, upload resumes, and apply for jobs. 
          Doltec does not guarantee interviews, job offers, or employment. 
          All final decisions rest with the employer. Candidates must ensure 
          that resumes and application information are truthful and accurate.
        </p>

        <h2>5. Payments</h2>
        <p>
          Employers may access premium features through subscription or one-time 
          payments. Payments are processed securely via trusted payment gateways. 
          All payments are final and non-refundable, unless specifically mentioned 
          in our <strong>Refund Policy</strong>.
        </p>

        <h2>➡ Our Terms in Simple Words</h2>
        <p>
          We believe in transparency. Here’s a quick summary of our terms:
        </p>
        <ul>
          <li>✅ Use Doltec honestly and responsibly.</li>
          <li>✅ Employers must post only genuine job opportunities.</li>
          <li>✅ Candidates should provide truthful resumes and applications.</li>
          <li>✅ Payments made for premium services are generally non-refundable.</li>
          <li>✅ Doltec is a platform only — we don’t guarantee hiring results.</li>
          <li>✅ Misuse of the platform can result in suspension or termination.</li>
        </ul>
        <p>
          These highlights are for your convenience. Please read the full 
          Terms &amp; Conditions for complete details.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All trademarks, branding, content, designs, and software on Doltec 
          are the intellectual property of the company. Users are prohibited 
          from copying, distributing, or creating derivative works without 
          written permission from Doltec.
        </p>

        <h2>7. Data Protection</h2>
        <p>
          Doltec is committed to protecting user data. Personal information 
          collected will be processed in compliance with applicable data 
          protection laws and as per our <Link to="/privacypolicy">Privacy Policy</Link>.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          Doltec serves as a technology intermediary and does not participate 
          in hiring decisions. We do not guarantee the accuracy of user content 
          or job listings. Doltec will not be responsible for financial losses, 
          missed opportunities, or disputes between employers and candidates.
        </p>

        <h2>9. Termination of Access</h2>
        <p>
          Doltec reserves the right to suspend, restrict, or terminate accounts 
          that violate these terms. Such action may be taken without prior notice 
          if the violation poses a risk to platform integrity or user trust.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of India. Any disputes shall 
          be subject to the exclusive jurisdiction of courts in Bangalore, India.
        </p>

        <h2>11. Dispute Resolution</h2>
        <p>
          Any disputes arising shall first be attempted to be resolved amicably. 
          If unresolved, disputes will be referred to arbitration in Bangalore, 
          in accordance with the Arbitration and Conciliation Act, 1996.
        </p>

        <h2>12. Amendments</h2>
        <p>
          Doltec reserves the right to amend or update these Terms at any time. 
          Users are encouraged to review this page periodically. Continued use 
          of the platform after updates signifies acceptance of the revised terms.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          For questions, please contact us at: <br />
          <strong>Email:</strong> support@doltec.in <br />
          <strong>Address:</strong> Doltec Pvt. Ltd., Bangalore, India
        </p>
      </div>
    </div>
    </div>
  );
}
