import React, { useState } from 'react';

const FormTask = ({ task }) => {
  const [formData, setFormData] = useState({
    loanType: 'personal',
    name: '',
    email: '',
    phone: '',
    income: '',
    loanAmount: '',
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name) { newErrors.name = 'Name is required.'; isValid = false; }
    if (!formData.email) { newErrors.email = 'Email is required.'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid.'; isValid = false; }
    if (!formData.phone) { newErrors.phone = 'Phone is required.'; isValid = false; }
    else if (!/^\d{10}$/.test(formData.phone)) { newErrors.phone = 'Phone number is invalid (10 digits).'; isValid = false; }
    if (!formData.income || isNaN(formData.income) || parseFloat(formData.income) <= 0) {
      newErrors.income = 'Valid income is required.'; isValid = false;
    }
    if (!formData.loanAmount || isNaN(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Valid loan amount is required.'; isValid = false;
    } else if (parseFloat(formData.loanAmount) < 1000 || parseFloat(formData.loanAmount) > (formData.loanType === 'personal' ? 50000 : 500000)) {
      newErrors.loanAmount = `Loan amount must be between $1,000 and $${formData.loanType === 'personal' ? '50,000' : '500,000'}.`; isValid = false;
    }
    if (!formData.purpose) { newErrors.purpose = 'Purpose is required.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmissionStatus('Submitting application...');
      setTimeout(() => {
        setSubmissionStatus('Application submitted successfully! We will review it shortly.');
        console.log('Form Data Submitted:', formData);
        // Reset form
        setFormData({
          loanType: 'personal', name: '', email: '', phone: '', income: '',
          loanAmount: '', purpose: ''
        });
        setErrors({});
      }, 2000);
    } else {
      setSubmissionStatus('Please correct the errors in the form.');
    }
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <form onSubmit={handleSubmit}>
        <label>
          Loan Type:
          <select name="loanType" value={formData.loanType} onChange={handleChange}>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
          </select>
        </label>
        <label>
          Full Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={validateForm} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={validateForm} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={validateForm} />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </label>
        <label>
          Annual Income ($):
          <input type="number" name="income" value={formData.income} onChange={handleChange} onBlur={validateForm} />
          {errors.income && <span className="error-message">{errors.income}</span>}
        </label>
        <label>
          Loan Amount ($):
          <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} onBlur={validateForm} />
          {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
        </label>
        <label>
          Loan Purpose:
          <textarea name="purpose" value={formData.purpose} onChange={handleChange} onBlur={validateForm}></textarea>
          {errors.purpose && <span className="error-message">{errors.purpose}</span>}
        </label>
        <button type="submit">Submit Application</button>
        {submissionStatus && (
          <p className={submissionStatus.includes('successfully') ? 'success-message' : 'error-message'}>
            {submissionStatus}
          </p>
        )}
      </form>
    </div>
  );
};

export default FormTask;