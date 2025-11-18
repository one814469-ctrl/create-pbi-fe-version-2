import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { isRequired, isValidEmail, isValidPhoneNumber, isPositiveNumber, isValidLoanAmount } from '../../utils/validation';
import { mockApiCall } from '../../lib/api/mockApi';

const LoanApplicationFormTask = ({ task }) => {
  const showToast = useToast();
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
      case 'purpose':
        if (!isRequired(value)) error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
        break;
      case 'email':
        if (!isRequired(value)) error = 'Email is required.';
        else if (!isValidEmail(value)) error = 'Email is invalid.';
        break;
      case 'phone':
        if (!isRequired(value)) error = 'Phone number is required.';
        else if (!isValidPhoneNumber(value)) error = 'Phone number is invalid (10 digits).';
        break;
      case 'income':
        if (!isRequired(value)) error = 'Annual income is required.';
        else if (!isPositiveNumber(value)) error = 'Annual income must be a positive number.';
        break;
      case 'loanAmount':
        if (!isRequired(value)) error = 'Loan amount is required.';
        else if (!isPositiveNumber(value)) error = 'Loan amount must be a positive number.';
        else if (!isValidLoanAmount(parseFloat(value), formData.loanType)) {
          const minAmount = 1000;
          const maxPersonalAmount = 50000;
          const maxHomeAmount = 500000;
          error = `${formData.loanType === 'personal' ? 'Personal' : 'Home'} loan amount must be between $${minAmount.toLocaleString()} and $${formData.loanType === 'personal' ? maxPersonalAmount.toLocaleString() : maxHomeAmount.toLocaleString()}.`;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;
    for (const [name, value] of Object.entries(formData)) {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
        formIsValid = false;
      }
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await mockApiCall(formData, 'Failed to submit loan application.');
        showToast('Application submitted successfully! We will review it shortly.', 'success');
        console.log('Form Data Submitted:', formData);
        setFormData({
          loanType: 'personal', name: '', email: '', phone: '', income: '',
          loanAmount: '', purpose: ''
        });
        setErrors({});
      } catch (error) {
        showToast(`Submission failed: ${error.message}`, 'error');
        console.error('Submission error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast('Please correct the errors in the form.', 'warning');
    }
  };

  return (
    <div>
      <h5>{task.title}</h5>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
        <Input
          label="Loan Type:"
          type="select" // Custom type for select
          name="loanType"
          value={formData.loanType}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <select
            id="loanType"
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: 'var(--spacing-s)', border: '1px solid #ccc', borderRadius: 'var(--border-radius-sm)' }}
          >
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
          </select>
        </Input>
        <Input
          label="Full Name:"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
        />
        <Input
          label="Email:"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <Input
          label="Phone Number:"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
        />
        <Input
          label="Annual Income ($):"
          type="number"
          name="income"
          value={formData.income}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.income}
        />
        <Input
          label="Loan Amount ($):"
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.loanAmount}
        />
        <Input
          label="Loan Purpose:"
          type="textarea"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.purpose}
          rows="3"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
};

export default LoanApplicationFormTask;