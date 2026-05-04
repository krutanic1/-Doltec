import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import Cookies from 'js-cookie';


const subscriptionPlans = {
  '1month': { price: 2499, gst: 18, duration: '1 Month', cycles: 1 },
  '3months': { price: 6490, gst: 18, duration: '3 Months', cycles: 3 },
  '6months': { price: 11890, gst: 18, duration: '6 Months', cycles: 6 },
  '12months': { price: 21890, gst: 18, duration: '1 Year', cycles: 12 },
};

const CompanyChooseaplan = () => {
  const [company, setCompany] = useState({
    companyId: '',
    name: '',
    email: '',
    subscriptionPlan: null,
    accessLevel: 'basic',
    subscriptionEnd: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const companyData = localStorage.getItem('company');
        const companyId = localStorage.getItem('companyId')?.trim();
        console.log('Fetching data for companyId:', companyId, 'Company Data:', companyData);

        if (!companyId) {
          setError('No company data found. Please log in.');
          setLoading(false);
          return;
        }

        // Use localStorage data if available
        if (companyData) {
          const companyInfo = JSON.parse(companyData);
          if (companyInfo.companyId === companyId) {
            setCompany({
              companyId: companyInfo.companyId || '',
              name: localStorage.getItem('name') || companyInfo.name || '',
              email: companyInfo.email || '',
              subscriptionPlan: companyInfo.subscriptionPlan || null,
              accessLevel: companyInfo.accessLevel || 'basic',
              subscriptionEnd: companyInfo.subscriptionEnd || null,
            });
          }
        }
        // Fetch fresh data
        const response = await axios.get(`${API}/company/profile/${companyId}`, {
          timeout: 5000,
        });
        console.log('Fetched company data:', response.data);

        setCompany({
          companyId,
          name: response.data.companyName || localStorage.getItem('name') || '',
          email: response.data.email || '',
          subscriptionPlan: response.data.subscriptionPlan || null,
          accessLevel: response.data.accessLevel || 'basic',
          subscriptionEnd: response.data.subscriptionEnd || null,
        });
        localStorage.setItem('company', JSON.stringify({
          companyId,
          name: response.data.companyName || '',
          email: response.data.email || '',
          subscriptionPlan: response.data.subscriptionPlan || null,
          accessLevel: response.data.accessLevel || 'basic',
          subscriptionEnd: response.data.subscriptionEnd || null,
        }));
        setError(null);
      } catch (error) {
        console.error('Error fetching company data:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to fetch company data. Please check your connection or try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const initiateSubscription = async (planType) => {
    try {
      const companyId = localStorage.getItem('companyId');
      const companyToken = Cookies.get('companyToken');
      if (!companyId || !companyToken) {
        setError('Please log in to select a plan.');
        return;
      }
      setLoading(true);
      setError(null);

      const { price, cycles } = subscriptionPlans[planType];
      const planResponse = await axios.post(
        `${API}/company/payment/create-subscription`,
        { planType, companyId },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );
      const { key_id, subscription_id } = planResponse.data;

      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded');
      }
      const options = {
        key: key_id,
        subscription_id,
        name: 'Doltec PVT LTD',
        description: `${subscriptionPlans[planType].duration} Plan (₹${price} + ${subscriptionPlans[planType].gst}% GST)`,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${API}/company/payment/verify-subscription`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                companyId,
              },
              { headers: { Authorization: `Bearer ${companyToken}` } }
            );
            setCompany({
              companyId,
              name: localStorage.getItem('name') || verifyResponse.data.company.name || '',
              email: verifyResponse.data.company.email || '',
              subscriptionPlan: verifyResponse.data.company.subscriptionPlan,
              accessLevel: verifyResponse.data.company.accessLevel,
              subscriptionEnd: verifyResponse.data.company.subscriptionEnd,
            });
            localStorage.setItem('company', JSON.stringify({
              companyId,
              name: localStorage.getItem('name') || verifyResponse.data.company.name || '',
              subscriptionPlan: verifyResponse.data.company.subscriptionPlan,
              accessLevel: verifyResponse.data.company.accessLevel,
              subscriptionEnd: verifyResponse.data.company.subscriptionEnd,
            }));
            setError(null);
            alert('Subscription successful! Access updated.');
          } catch (error) {
            console.error('Error verifying subscription:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to verify subscription');
          }
        },
        prefill: {
          name: company.name || 'Company Name',
          email: company.email || 'company@example.com',
          contact: company.phone || '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating subscription:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to start subscription');
    } finally {
      setLoading(false);
    }
  };


  const getPriceDetails = (planType) => {
    const { price, gst } = subscriptionPlans[planType];
    const gstAmount = (price * gst) / 100;
    const total = price + gstAmount;
    return `₹${price} + ${gst}% GST = ₹${total}`;
  };

  return (
    <div id="companychooseaplan">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2>Choose Your Company Subscription Plan</h2>
          <p>
            Current Plan: {company.subscriptionPlan || 'None'} | 
            Status: {company.subscriptionEnd && new Date(company.subscriptionEnd) > new Date() ? 'Active' : 'Expired'}
          </p>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
        </div>
        <div className="plans">
          <div className="plan">
            <h2>1 Month</h2>
            <div className="price">{getPriceDetails('1month')}</div>
            <ul>
              <li>Unlimited Job Postings</li>
              <li>Basic Job Analytics</li>
              <li>Standard Candidate Access</li>
            </ul>
            <button onClick={() => initiateSubscription('1month')} disabled={loading}>
              CHOOSE PLAN
            </button>
          </div>
          <div className="plan">
            <h2>3 Months</h2>
            <div className="price">{getPriceDetails('3months')}</div>
            <ul>
              <li>Unlimited Job Postings</li>
              <li>Advanced Job Analytics</li>
              <li>Standard Candidate Access</li>
            </ul>
            <button onClick={() => initiateSubscription('3months')} disabled={loading}>
              CHOOSE PLAN
            </button>
          </div>
          <div className="plan">
            <h2>6 Months</h2>
            <div className="price">{getPriceDetails('6months')}</div>
            <ul>
              <li>Unlimited Job Postings</li>
              <li>Advanced Job Analytics</li>
              <li>Priority Candidate Access</li>
              <li>Featured Job Listings</li>
            </ul>
            <button onClick={() => initiateSubscription('6months')} disabled={loading}>
              CHOOSE PLAN
            </button>
          </div>
          <div className="plan">
            <h2>1 Year</h2>
            <div className="price">{getPriceDetails('12months')}</div>
            <ul>
              <li>Unlimited Job Postings</li>
              <li>Full Job Analytics</li>
              <li>Instant Candidate Connect</li>
              <li>Featured Job Listings</li>
              <li>Premium Support</li>
            </ul>
            <button onClick={() => initiateSubscription('12months')} disabled={loading}>
              CHOOSE PLAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyChooseaplan;