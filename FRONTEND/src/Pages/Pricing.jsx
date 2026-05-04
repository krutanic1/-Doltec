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
    <div id="pricing">
        <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <h1>Flexible Plans for Your Hiring Needs</h1>
        <p>
          Choose a plan to post jobs, manage candidates, conduct interviews, and
          share offer letters directly from your dashboard.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-container">
        {plans.map((plan, index) => {
          const total = calculateGST(plan.amount);
          return (
            <div key={index} className="pricing-card">
              <h3>{plan.name}</h3>
              <p className="amount">
                ₹{plan.amount.toLocaleString()} + 18% GST
              </p>
              <p className="total">
                <strong>Total:</strong> ₹{total.toFixed(2)}
              </p>
              <ul className="features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
             <button className="buy-button"><Link to="/CompanyLogin">Subscribe</Link></button>
            </div>
          );
        })}
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <h2>Get Started With Your Hiring Workflow</h2>
        <p>
          Select a plan and start posting jobs, managing candidates, conducting
          interviews, and sharing offer letters all from your dashboard.
        </p>
        <button className="cta-button">
            <Link to="/contactus">Contact Sales</Link>
        </button>
      </section>
    </div>
    </div>
  );
}
