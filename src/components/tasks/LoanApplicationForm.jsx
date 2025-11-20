import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const LoanApplicationForm = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { addApplication } = useLoan();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    loanType: 'Personal Loan',
    amount: '',
    income: '',
    termsAgreed: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Acceptance Criteria: [Negative] Given I am not authenticated
  if (!isAuthenticated) {
    displayMessage('error', 'You must be logged in to submit a loan application.');
    return (
      <p className="error-message">
        Please log in to submit a loan application.
        <button onClick={() => navigate('/epics/account-authentication-access')} style={{ marginLeft: '1rem' }}>Login</button>
      </p>
    );
  }
  // Ensure only customers can apply
  if (user?.role !== 'customer') {
    displayMessage('error', `Access Denied: Only customers can submit loan applications. Your role is ${user?.role}.`);
    return (
      <p className="error-message">
        Access Denied: Only customers can submit loan applications.
      </p>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.loanType) newErrors.loanType = 'Loan Type is required.';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Loan Amount must be positive.';
    if (!formData.income || formData.income <= 0) newErrors.income = 'Annual Income must be positive.';
    if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the terms.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Acceptance Criteria: [Edge] Given I submit an incomplete form
    if (!validateForm()) {
      displayMessage('error', 'Please correct the highlighted fields.');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newApplication = {
      id: `LA${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, // Mock ID
      customerName: formData.fullName,
      customerID: 'CUST001', // Mock customer ID for the logged-in user
      type: formData.loanType,
      amount: parseFloat(formData.amount),
      status: 'Application Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      documents: [],
      ocrExtractedData: null,
      documentVerificationStatus: 'Pending',
      creditScore: null,
      creditReport: null,
      creditCheckStatus: 'Pending',
      approvalStatus: 'Pending',
      complianceStatus: 'Pending',
      auditTrail: [{ timestamp: new Date().toISOString(), user: formData.email, action: 'Application Submitted' }]
    };

    addApplication(newApplication);

    // Acceptance Criteria: Then my application is saved and I receive a confirmation notification
    displayMessage('success', 'Loan application submitted successfully! Your application ID is ' + newApplication.id);
    setIsSubmitting(false);
    setFormData({ // Reset form
      fullName: '', email: '', loanType: 'Personal Loan', amount: '', income: '', termsAgreed: false,
    });
    setErrors({});
    navigate('/epics/loan-application-portal'); // Redirect to dashboard or status page
  };

  return (
    <form onSubmit={handleSubmit} className="loan-application-form">
      <div className="form-group">
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={errors.fullName ? 'error-border' : ''}
          required
        />
        {errors.fullName && <p className="error-message">{errors.fullName}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error-border' : ''}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="loanType">Loan Type:</label>
        <select
          id="loanType"
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          className={errors.loanType ? 'error-border' : ''}
          required
        >
          <option value="Personal Loan">Personal Loan</option>
          <option value="Auto Loan">Auto Loan</option>
          <option value="Mortgage Loan">Mortgage Loan</option>
        </select>
        {errors.loanType && <p className="error-message">{errors.loanType}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Loan Amount ($):</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          className={errors.amount ? 'error-border' : ''}
          required
        />
        {errors.amount && <p className="error-message">{errors.amount}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="income">Annual Income ($):</label>
        <input
          type="number"
          id="income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          min="1"
          className={errors.income ? 'error-border' : ''}
          required
        />
        {errors.income && <p className="error-message">{errors.income}</p>}
      </div>

      <div className="form-group">
        <input
          type="checkbox"
          id="termsAgreed"
          name="termsAgreed"
          checked={formData.termsAgreed}
          onChange={handleChange}
          required
        />
        <label htmlFor="termsAgreed" style={{display: 'inline-block'}}>I agree to the terms and conditions.</label>
        {errors.termsAgreed && <p className="error-message">{errors.termsAgreed}</p>}
      </div>

      <div className="form-group">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default LoanApplicationForm;