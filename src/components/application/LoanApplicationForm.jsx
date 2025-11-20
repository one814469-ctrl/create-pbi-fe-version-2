import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';

const LoanApplicationForm = () => {
  const { isLoggedIn, checkAuth } = useAuth();
  const { addApplication } = useApplications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    loanAmount: '',
    loanType: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  React.useEffect(() => {
    if (!checkAuth('applicant')) {
      navigate('/login');
    }
  }, [isLoggedIn, checkAuth, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.applicantName) newErrors.applicantName = 'Applicant Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Loan Amount is required';
    } else if (isNaN(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Loan Amount must be a positive number';
    }
    if (!formData.loanType) newErrors.loanType = 'Loan Type is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      addApplication(formData);
      setMessage('Application submitted successfully!');
      setMessageType('success');
      setFormData({ applicantName: '', email: '', phone: '', loanAmount: '', loanType: '' });
      setTimeout(() => navigate('/application-status'), 2000);
    } else {
      setMessage('Please correct the errors in the form.');
      setMessageType('error');
    }
  };

  return (
    <div className="card">
      <h4>Loan Application Form Submission</h4>
      {message && <div className={`message-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="applicantName">Applicant Name</label>
          <input
            type="text"
            id="applicantName"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
          />
          {errors.applicantName && <p className="message-error">{errors.applicantName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="message-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="message-error">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
          />
          {errors.loanAmount && <p className="message-error">{errors.loanAmount}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="loanType">Loan Type</label>
          <select
            id="loanType"
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
          >
            <option value="">Select a loan type</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Vehicle Loan">Vehicle Loan</option>
            <option value="Business Loan">Business Loan</option>
          </select>
          {errors.loanType && <p className="message-error">{errors.loanType}</p>}
        </div>
        <div className="form-actions">
          <button type="submit">Submit Application</button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;