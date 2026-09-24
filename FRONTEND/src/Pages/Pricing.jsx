import {Link} from "react-router-dom";
export default function Pricing() {
  const plans = [
    {
      name: "1 Month",
      amount: 2499,
      features: [
         "Unlimited job postings",
        "Full access to candidate database",
        "Complete hiring workflow",
        "Shortlist & reject candidates",
        "Schedule interviews",
        "Upload offer letters directly to selected candidates",
       
       
      ],
    },
    {
      name: "3 Months",
      amount: 6499,
      features: [
         "Unlimited job postings",
        "Full access to candidate database",
        "Complete hiring workflow",
        "Shortlist & reject candidates",
        "Schedule interviews",
        "Upload offer letters directly to selected candidates",
       
        
      ],
    },
    {
      name: "6 Months",
      amount: 11890,
      features: [
        "Unlimited job postings",
        "Full access to candidate database",
        "Complete hiring workflow",
        "Shortlist & reject candidates",
        "Schedule interviews",
        "Upload offer letters directly to selected candidates",
        "Priority support 24/7",
      ],
    },
    {
      name: "1 Year",
      amount: 21890,
      features: [
        "Unlimited job postings",
        "Full access to candidate database",
        "Complete hiring workflow",
        "Shortlist & reject candidates",
        "Schedule interviews",
        "Upload offer letters directly to selected candidates",
        "Dedicated account manager",
        "Priority support 24/7",
      ],
    },
  ];

  const calculateGST = (amount) => amount + amount * 0.18;

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#0f172a", fontFamily: "'Inter', sans-serif", padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#000000", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
            Flexible Plans for Your Hiring Needs
          </h1>
          <p style={{ color: "#64748b", fontSize: "18px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Choose a plan to post jobs, manage candidates, conduct interviews, and share offer letters directly from your dashboard.
          </p>
        </section>

        {/* Pricing Cards */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "60px" }}>
          {plans.map((plan, index) => {
            const total = calculateGST(plan.amount);
            return (
              <div key={index} style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"; }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{plan.name}</h3>
                
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>₹{plan.amount.toLocaleString()} + 18% GST</div>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "#000000", letterSpacing: "-1px" }}>₹{total.toFixed(0)}</div>
                </div>

                <ul style={{ padding: 0, margin: "0 0 32px 0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#334155", fontSize: "15px", lineHeight: "1.5" }}>
                      <span style={{ color: "#2563eb", marginTop: "2px" }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/CompanyLogin" style={{ display: "block", textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "16px", backgroundColor: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
                    Subscribe Now
                  </button>
                </Link>
              </div>
            );
          })}
        </section>

        {/* CTA Section */}
        <section style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#000000", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Get Started With Your Hiring Workflow
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px", maxWidth: "600px", margin: "0 auto 32px auto", lineHeight: "1.6" }}>
            Select a plan and start posting jobs, managing candidates, conducting interviews, and sharing offer letters all from your dashboard.
          </p>
          <Link to="/contactus" style={{ textDecoration: "none" }}>
            <button style={{ padding: "16px 32px", backgroundColor: "#ffffff", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.borderColor = "#94a3b8"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#cbd5e1"; }}>
              Contact Sales
            </button>
          </Link>
        </section>

      </div>
    </div>
  );
}
