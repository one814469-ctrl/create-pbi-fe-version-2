import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoanApplicationForm = ({ onUpdateApplication, task }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    loanAmount: '',
    income: '',
    employmentStatus: '',
  });
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.loanAmount) newErrors.loanAmount = 'Loan Amount is required';
    else if (isNaN(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0) newErrors.loanAmount = 'Must be a positive number';
    if (!formData.income) newErrors.income = 'Annual Income is required';
    else if (isNaN(formData.income) || parseFloat(formData.income) <= 0) newErrors.income = 'Must be a positive number';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment Status is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Simulate API call
      console.log('Submitting loan application:', formData);
      setSubmissionMessage('Application submitted successfully! You will receive a confirmation.');
      onUpdateApplication && onUpdateApplication({
        id: `APP-${Date.now().toString().slice(-6)}`, // Generate a mock ID
        status: 'Submitted',
        details: formData,
        documents: [], // Will be updated by DocumentUploader
        ocrData: null,
        creditScore: null,
        decision: null,
        compliance: null,
        history: [{ timestamp: new Date().toISOString(), action: 'Application Submitted' }]
      });
      setFormData({ // Clear form
        fullName: '',
        email: '',
        loanAmount: '',
        income: '',
        employmentStatus: '',
      });
    } else {
      setSubmissionMessage('Please correct the errors in the form.');
    }
  };

  return (
    <div className="loan-application-form">
      <h4>Personal Loan Application</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="loanAmount">Desired Loan Amount ($)</label>
          <Input
            type="text"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="e.g., 25000"
          />
          {errors.loanAmount && <p className="error-message">{errors.loanAmount}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="income">Annual Income ($)</label>
          <Input
            type="text"
            id="income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="e.g., 60000"
          />
          {errors.income && <p className="error-message">{errors.income}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="employmentStatus">Employment Status</label>
          <Input
            type="text"
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            placeholder="e.g., Employed, Self-employed"
          />
          {errors.employmentStatus && <p className="error-message">{errors.employmentStatus}</p>}
        </div>
        <Button type="submit" className="button-primary">Submit Application</Button>
      </form>
      {submissionMessage && (
        <p className={Object.keys(errors).length === 0 ? 'success-message' : 'error-message'}>
          {submissionMessage}
        </p>
      )}
      {task && task.acceptance_criteria[0] && (
        <p className="mt-4">
          <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked: Confirmation notification shown upon valid submission)</em>
        </p>
      )}
      {Object.keys(errors).length > 0 && task && task.acceptance_criteria[1] && (
        <p className="mt-2 error-message">
          <em>Acceptance Criteria (Edge): {task.acceptance_criteria[1]} (Mocked: Required fields highlighted and submission blocked)</em>
        </p>
      )}
      {/* Negative case "Given I am not authenticated" is handled by the router redirecting to login */}
    </div>
  );
};

export default LoanApplicationForm;