import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { useNavigate } from 'react-router-dom';

const LoanApplicationForm = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { addApplication } = useLoan();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.username || '',
    loanType: 'Personal Loan',
    amount: '',
    income: '',
    termsAgreed: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to submit a loan application.');
    return (
      <div className="card w-full max-w-lg mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Loan Application Submission</p>
        </div>
        <div className="card-content">
          <p className="error-text">Please log in to submit a loan application.</p>
          <button onClick={() => navigate('/epics/account-authentication-access')} className="mt-4">Login</button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'customer') {
    displayMessage('error', 'Access Denied', `Only customers can submit loan applications. Your role is ${user?.role}.`);
    return (
      <div className="card w-full max-w-lg mx-auto my-8">
        <div className="card-header">
          <h3 className="card-title text-destructive">Access Denied</h3>
          <p className="card-description">Loan Application Submission</p>
        </div>
        <div className="card-content">
          <p className="error-text">Only customers can submit loan applications.</p>
        </div>
      </div>
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
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Loan Amount must be positive.';
    if (!formData.income || parseFloat(formData.income) <= 0) newErrors.income = 'Annual Income must be positive.';
    if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the terms.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      displayMessage('error', 'Validation Error', 'Please correct the highlighted fields.');
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newApplication = {
      id: `LA${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
      customerName: formData.fullName,
      customerID: user.customerID,
      type: formData.loanType,
      amount: parseFloat(formData.amount),
      status: 'Application Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      documents: [],
      ocrExtractedData: null,
      documentVerificationStatus: 'Pending',
      creditScore: null,
      creditReport: null,
      approvalStatus: 'Pending',
      complianceStatus: 'Pending',
      auditTrail: [{ timestamp: new Date().toISOString(), user: formData.email, action: 'Application Submitted' }]
    };

    addApplication(newApplication);

    displayMessage('success', 'Application Submitted', `Your loan application has been submitted successfully! Your application ID is ${newApplication.id}`);
    setIsSubmitting(false);
    setFormData({
      fullName: '', email: user?.username || '', loanType: 'Personal Loan', amount: '', income: '', termsAgreed: false,
    });
    setErrors({});
    navigate('/epics/loan-application-portal');
  };

  return (
    <div className="card w-full max-w-2xl mx-auto">
      <div className="card-header">
        <h3 className="card-title">Submit Personal Loan Application</h3>
        <p className="card-description">Complete and submit a personal loan application digitally.</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error-border w-full' : 'w-full'}
              required
            />
            {errors.fullName && <p className="error-text text-sm">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-border w-full' : 'w-full'}
              required
              disabled={!!user?.username}
            />
            {errors.email && <p className="error-text text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              className={errors.loanType ? 'error-border w-full' : 'w-full'}
              required
            >
              <option value="Personal Loan">Personal Loan</option>
              <option value="Auto Loan">Auto Loan</option>
              <option value="Mortgage Loan">Mortgage Loan</option>
            </select>
            {errors.loanType && <p className="error-text text-sm">{errors.loanType}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount">Loan Amount ($)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              className={errors.amount ? 'error-border w-full' : 'w-full'}
              required
            />
            {errors.amount && <p className="error-text text-sm">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="income">Annual Income ($)</label>
            <input
              id="income"
              name="income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              min="1"
              className={errors.income ? 'error-border w-full' : 'w-full'}
              required
            />
            {errors.income && <p className="error-text text-sm">{errors.income}</p>}
          </div>

          <div className="flex-row items-center space-x-2">
            <input
              type="checkbox"
              id="termsAgreed"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              required
              className={errors.termsAgreed ? 'error-border' : ''}
            />
            <label htmlFor="termsAgreed">I agree to the terms and conditions.</label>
            {errors.termsAgreed && <p className="error-text text-sm">{errors.termsAgreed}</p>}
          </div>

          <button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;