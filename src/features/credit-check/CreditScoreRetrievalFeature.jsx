import React from 'react'

const CreditScoreRetrievalFeature = ({
  task,
  applicantDetails,
  onDetailsChange,
  onRetrieveScore,
  retrievedScore,
  retrievalStatus,
  warning
}) => {
  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <h5>Applicant Details (Mock):</h5>
      <div className="form-group">
        <label htmlFor="applicantId">Applicant ID:</label>
        <input type="text" id="applicantId" name="id" value={applicantDetails.id} onChange={onDetailsChange} />
      </div>
      <div className="form-group">
        <label htmlFor="applicantName">Name:</label>
        <input type="text" id="applicantName" name="name" value={applicantDetails.name} onChange={onDetailsChange} />
      </div>
      <div className="form-group">
        <label htmlFor="applicantDob">Date of Birth:</label>
        <input type="date" id="applicantDob" name="dob" value={applicantDetails.dob} onChange={onDetailsChange} />
      </div>

      <button onClick={onRetrieveScore} disabled={retrievalStatus === 'fetching'}>
        {retrievalStatus === 'fetching' ? 'Fetching Score...' : 'Retrieve Credit Score'}
      </button>

      {warning && (
        <p className={`alert ${retrievalStatus === 'error' ? 'alert-danger' : 'alert-warning'}`}>
          {warning}
        </p>
      )}

      {retrievalStatus === 'success' && (
        <div style={{ marginTop: '20px' }}>
          <h5>Retrieved Credit Score:</h5>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--color-primary)' }}>{retrievedScore}</p>
        </div>
      )}

      {retrievalStatus === 'idle' && !retrievedScore && (
        <p style={{ marginTop: '20px' }} className="alert alert-info">Enter applicant details and click 'Retrieve Credit Score' to fetch data from the Credit Bureau API.</p>
      )}
    </div>
  )
}

export default CreditScoreRetrievalFeature