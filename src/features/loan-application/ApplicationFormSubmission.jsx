import React, { useState } from 'react'

const ApplicationFormSubmission = ({ task, onApplicationSubmit, isLoggedIn }) => {
  const [loanType, setLoanType] = useState('')
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const supportedLoanTypes = ['Personal Loan', 'Home Loan']

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setConfirmation('')

    if (!isLoggedIn) {
      setError('You must be logged in to submit an application.')
      return
    }

    if (!loanType || !amount || !name || !email) {
      setError('All fields are required.')
      return
    }

    if (!supportedLoanTypes.includes(loanType)) {
      setError('Selected loan product is not supported for online application.')
      return
    }

    const newApplicationId = `APP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    setConfirmation(`Application ${newApplicationId} submitted successfully!`)
    onApplicationSubmit(newApplicationId)

    setLoanType('')
    setAmount('')
    setName('')
    setEmail('')
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loanType">Loan Type:</label>
          <select id="loanType" value={loanType} onChange={(e) => setLoanType(e.target.value)}>
            <option value="">Select a loan type</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Car Loan">Car Loan (Not Supported)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Loan Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {confirmation && <p className="success-message">{confirmation}</p>}
        <button type="submit" disabled={!isLoggedIn}>Submit Application</button>
      </form>
      {!isLoggedIn && <p className="alert alert-info">Please log in to submit an application.</p>}
    </div>
  )
}

export default ApplicationFormSubmission