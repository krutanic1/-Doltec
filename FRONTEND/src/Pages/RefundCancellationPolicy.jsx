
const RefundCancellationPolicy = () => {
  return (
    <div id="refundcancellationpolicy">
        <section className="rcp">
      <div className="rcp__card">
        <h1 className="rcp__title">Refund &amp; Cancellation Policy </h1>
        <p className="rcp__intro">
          At Doltec, we are committed to delivering a seamless recruitment experience.
          This Refund &amp; Cancellation Policy defines our practices regarding payments
          made on our platform.
        </p>

        <div className="rcp__section">
          <h2 className="rcp__heading">1. Cancellation of Services</h2>
          <ul className="rcp__list">
            <li>
              No cancellations are permitted once a service (job posting, premium
              feature, or subscription) has been purchased or activated.
            </li>
            <li>
              Employers and candidates are therefore advised to carefully review
              services before making a payment.
            </li>
          </ul>
        </div>

        <div className="rcp__section">
          <h2 className="rcp__heading">2. Refund Eligibility</h2>
          <ul className="rcp__list">
            <li>Refunds will only be considered under the following circumstances:</li>
            <li className="rcp__subpoint">Duplicate payment due to a technical error.</li>
            <li className="rcp__subpoint">
              Payment deducted but service not activated due to system failure.
            </li>
            <li className="rcp__note">
              No refunds shall be processed for change of mind, dissatisfaction with
              service usage, or after a job posting/service has been utilized.
            </li>
          </ul>
        </div>

        <div className="rcp__section">
          <h2 className="rcp__heading">3. Refund Processing Timeline</h2>
          <ul className="rcp__list">
            <li>
              Verified and approved refund requests will be processed within
              <strong> 15–30 working days</strong> from the date of approval.
            </li>
            <li>
              The time taken to reflect in your account depends on your bank/payment
              gateway policies, and Doltec will not be liable for any delays on their end.
            </li>
          </ul>
        </div>

        <div className="rcp__section">
          <h2 className="rcp__heading">4. Mode of Refund</h2>
          <ul className="rcp__list">
            <li>
              All refunds will be credited back to the original payment method used
              during the transaction.
            </li>
            <li>No cash or alternative mode of refund will be entertained.</li>
          </ul>
        </div>

        <div className="rcp__section">
          <h2 className="rcp__heading">5. Refund Request Procedure</h2>
          <p className="rcp__paragraph">
            To initiate a refund request, users must email{" "}
            <a className="rcp__link" href="mailto:support@doltec.in">
              support@doltec.in
            </a>{" "}
            with the following details:
          </p>
          <ul className="rcp__list rcp__list--bullets">
            <li>Transaction ID</li>
            <li>Date of Payment</li>
            <li>Registered Email ID and Contact Number</li>
            <li>Proof of deduction (e.g., payment screenshot/statement)</li>
          </ul>
          <p className="rcp__paragraph">
            Doltec reserves the right to verify all refund claims and reject those that
            do not meet the above criteria.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
};

export default RefundCancellationPolicy;
