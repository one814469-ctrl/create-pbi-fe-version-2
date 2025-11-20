import React, { useState } from 'react'
import { useApplications } from '../../context/ApplicationContext'
import NotificationDisplay from '../NotificationDisplay'
import LoadingSpinner from '../LoadingSpinner'

function ApplicationForm({ onSubmitSuccess, customerEmail, customerName }) {
  const [formData, setFormData] = useState({
    fullName: customerName || '',
    email: customerEmail || '',
    loanType: '',
    loanAmount: '',
    income: '',
    employmentStatus: '',
    creditScoreConsent: false,
  })
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addApplication } = useApplications()

  const loanTypes = ['Personal Loan', 'Home Loan', 'Car Loan (unsupported)']

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.'
    if (!formData.email) newErrors.email = 'Email is required.'
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid.'
    if (!formData.loanType) newErrors.loanType = 'Loan Type is required.'
    if (formData.loanType === 'Car Loan (unsupported)') newErrors.loanType = 'This loan product is not supported.'
    if (!formData.loanAmount || formData.loanAmount <= 0) newErrors.loanAmount = 'Loan Amount must be a positive number.'
    if (!formData.income || formData.income <= 0) newErrors.income = 'Annual Income must be a positive number.'
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment Status is required.'
    if (!formData.creditScoreConsent) newErrors.creditScoreConsent = 'Consent for credit score check is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmissionError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionError('')
    if (!validateForm()) {
      setSubmissionError('Please correct the errors in the form.')
      return
    }

    setLoading(true)
    try {
      const response = await addApplication(formData)
      if (response.success) {
        onSubmitSuccess(response.id)
        setFormData({
          fullName: customerName || '',
          email: customerEmail || '',
          loanType: '',
          loanAmount: '',
          income: '',
          employmentStatus: '',
          creditScoreConsent: false,
        })
      } else {
        setSubmissionError(response.message || 'Failed to submit application.')
      }
    } catch (err) {
      setSubmissionError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Submit New Loan Application</h3>
      {submissionError && <NotificationDisplay message={submissionError} type="error" />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
          >
            <option value="">Select a loan type</option>
            {loanTypes.map((type) => (
              <option key={type} value={type} disabled={type.includes('(unsupported)')}>
                {type}
              </option>
            ))}
          </select>
          {errors.loanType && <p className="error-message">{errors.loanType}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount (MUR):</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            min="1"
            disabled={loading}
          />
          {errors.loanAmount && <p className="error-message">{errors.loanAmount}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="income">Annual Income (MUR):</label>
          <input
            type="number"
            id="income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            min="1"
            disabled={loading}
          />
          {errors.income && <p className="error-message">{errors.income}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="employmentStatus">Employment Status:</label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
          {errors.employmentStatus && <p className="error-message">{errors.employmentStatus}</p>}
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="creditScoreConsent"
              name="creditScoreConsent"
              checked={formData.creditScoreConsent}
              onChange={handleChange}
              disabled={loading}
            />
            I consent to a credit score check.
          </label>
          {errors.creditScoreConsent && <p className="error-message">{errors.creditScoreConsent}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}

export default ApplicationForm