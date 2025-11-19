import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../common/Notification';
import { createLoanApplication } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/Form.css';

function LoanApplicationForm() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    loanAmount: '',
    loanPurpose: '',
    income: '',
    employmentStatus: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.loanAmount || isNaN(formData.loanAmount) || parseFloat(formData.loanAmount) <= 0)
      newErrors.loanAmount = 'Valid Loan Amount is required.';
    if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan Purpose is required.';
    if (!formData.income || isNaN(formData.income) || parseFloat(formData.income) <= 0)
      newErrors.income = 'Valid Income is required.';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment Status is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showNotification('You must be logged in to submit an application.', 'error');
      navigate('/epic/account-authentication-access');
      return;
    }

    if (!validate()) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createLoanApplication(formData);
      showNotification(`Application submitted! ID: ${response.id}`, 'success');
      setFormData({
        fullName: '', email: '', phone: '', address: '',
        loanAmount: '', loanPurpose: '', income: '', employmentStatus: '',
      });
      setErrors({});
    } catch (error) {
      showNotification(`Submission failed: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Personal Loan Application">
      <p>As an applicant, I want to complete a personal loan application form so that I can request a loan digitally.</p>
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          error={errors.fullName}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          error={errors.phone}
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          error={errors.address}
        />
        <Input
          label="Loan Amount ($)"
          name="loanAmount"
          type="number"
          value={formData.loanAmount}
          onChange={handleChange}
          required
          error={errors.loanAmount}
        />
        <Input
          label="Loan Purpose"
          name="loanPurpose"
          value={formData.loanPurpose}
          onChange={handleChange}
          required
          error={errors.loanPurpose}
        />
        <Input
          label="Annual Income ($)"
          name="income"
          type="number"
          value={formData.income}
          onChange={handleChange}
          required
          error={errors.income}
        />
        <Input
          label="Employment Status"
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          required
          error={errors.employmentStatus}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Card>
  );
}

export default LoanApplicationForm;