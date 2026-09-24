
const RefundCancellationPolicy = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0f172a", fontFamily: "'Inter', sans-serif", padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "800", color: "#000000", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            At Doltec, we are committed to delivering a seamless recruitment experience. This Refund & Cancellation Policy defines our practices regarding payments made on our platform.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "16px", lineHeight: "1.7", color: "#334155" }}>
          
          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>1. Cancellation of Services</h2>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>No cancellations are permitted once a service (job posting, premium feature, or subscription) has been purchased or activated.</li>
              <li>Employers and candidates are therefore advised to carefully review services before making a payment.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>2. Refund Eligibility</h2>
            <p style={{ marginBottom: "12px" }}>Refunds will only be considered under the following circumstances:</p>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Duplicate payment due to a technical error.</li>
              <li>Payment deducted but service not activated due to system failure.</li>
            </ul>
            <div style={{ backgroundColor: "#fff1f2", color: "#9f1239", padding: "16px", borderRadius: "8px", marginTop: "16px", border: "1px solid #fecdd3" }}>
              <strong>Note:</strong> No refunds shall be processed for change of mind, dissatisfaction with service usage, or after a job posting/service has been utilized.
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>3. Refund Processing Timeline</h2>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Verified and approved refund requests will be processed within <strong>15–30 working days</strong> from the date of approval.</li>
              <li>The time taken to reflect in your account depends on your bank/payment gateway policies, and Doltec will not be liable for any delays on their end.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>4. Mode of Refund</h2>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>All refunds will be credited back to the original payment method used during the transaction.</li>
              <li>No cash or alternative mode of refund will be entertained.</li>
            </ul>
          </section>

          <section style={{ backgroundColor: "#f8fafc", padding: "32px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "16px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#000000", marginBottom: "12px" }}>5. Refund Request Procedure</h2>
            <p style={{ marginBottom: "16px" }}>
              To initiate a refund request, users must email <a href="mailto:support@doltec.in" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>support@doltec.in</a> with the following details:
            </p>
            <ul style={{ paddingLeft: "20px", margin: "0 0 16px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Transaction ID</li>
              <li>Date of Payment</li>
              <li>Registered Email ID and Contact Number</li>
              <li>Proof of deduction (e.g., payment screenshot/statement)</li>
            </ul>
            <p style={{ margin: 0, fontStyle: "italic", fontSize: "14px", color: "#64748b" }}>
              Doltec reserves the right to verify all refund claims and reject those that do not meet the above criteria.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundCancellationPolicy;
