import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils'; // For conditional classNames

const LoanApplicationForm = ({ displayMessage }) => {
  const { isAuthenticated, user } = useAuth();
  const { addApplication } = useLoan();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.username || '', // Pre-fill if logged in
    loanType: 'Personal Loan',
    amount: '',
    income: '',
    termsAgreed: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Acceptance Criteria: [Negative] Given I am not authenticated
  if (!isAuthenticated) {
    displayMessage('error', 'Authentication Required', 'You must be logged in to submit a loan application.');
    return (
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Loan Application Submission</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Please log in to submit a loan application.</p>
          <Button onClick={() => navigate('/epics/account-authentication-access')} className="mt-4">Login</Button>
        </CardContent>
      </Card>
    );
  }
  // Ensure only customers can apply
  if (user?.role !== 'customer') {
    displayMessage('error', 'Access Denied', `Only customers can submit loan applications. Your role is ${user?.role}.`);
    return (
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Loan Application Submission</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Only customers can submit loan applications.</p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    // Acceptance Criteria: [Edge] Given I submit an incomplete form
    if (!validateForm()) {
      displayMessage('destructive', 'Validation Error', 'Please correct the highlighted fields.');
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newApplication = {
      id: `LA${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`, // Mock ID
      customerName: formData.fullName,
      customerID: user.customerID, // Use actual customer ID from context
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

    displayMessage('success', 'Application Submitted', `Your loan application has been submitted successfully! Your application ID is ${newApplication.id}`);
    setIsSubmitting(false);
    setFormData({ // Reset form
      fullName: '', email: user?.username || '', loanType: 'Personal Loan', amount: '', income: '', termsAgreed: false,
    });
    setErrors({});
    navigate('/epics/loan-application-portal'); // Redirect to dashboard or status page
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Personal Loan Application</CardTitle>
        <CardDescription>Complete and submit a personal loan application digitally.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={cn(errors.fullName && 'error-border')}
              required
            />
            {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(errors.email && 'error-border')}
              required
              disabled={!!user?.username} // Disable if pre-filled from authenticated user
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select name="loanType" value={formData.loanType} onValueChange={(value) => handleSelectChange(value, 'loanType')}>
              <SelectTrigger className={cn(errors.loanType && 'error-border')}>
                <SelectValue placeholder="Select a loan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                <SelectItem value="Mortgage Loan">Mortgage Loan</SelectItem>
              </SelectContent>
            </Select>
            {errors.loanType && <p className="text-destructive text-sm">{errors.loanType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              className={cn(errors.amount && 'error-border')}
              required
            />
            {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input
              id="income"
              name="income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              min="1"
              className={cn(errors.income && 'error-border')}
              required
            />
            {errors.income && <p className="text-destructive text-sm">{errors.income}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsAgreed"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAgreed: checked }))}
              className={cn(errors.termsAgreed && 'error-border')}
            />
            <Label htmlFor="termsAgreed">I agree to the terms and conditions.</Label>
            {errors.termsAgreed && <p className="text-destructive text-sm">{errors.termsAgreed}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;