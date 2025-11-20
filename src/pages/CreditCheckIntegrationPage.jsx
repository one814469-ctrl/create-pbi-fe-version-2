import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import CreditScoreRetrievalFeature from '../features/credit-check/CreditScoreRetrievalFeature'

const CreditCheckIntegrationPage = ({ epic }) => {
  const [applicantDetails, setApplicantDetails] = useState({
    id: 'APP001',
    name: 'John Doe',
    dob: '1985-01-15',
    address: '123 Main St'
  })
  const [retrievedScore, setRetrievedScore] = useState(null)
  const [retrievalStatus, setRetrievalStatus] = useState('idle')
  const [warning, setWarning] = useState(null)

  const handleDetailsChange = (e) => {
    setApplicantDetails({ ...applicantDetails, [e.target.name]: e.target.value })
  }

  const handleRetrieveScore = () => {
    setRetrievedScore(null)
    setWarning(null)
    setRetrievalStatus('fetching')

    setTimeout(() => {
      const apiAvailable = Math.random() > 0.1
      const incompleteData = Math.random() > 0.7

      if (!apiAvailable) {
        setRetrievalStatus('error')
        setWarning("Credit Bureau API is unavailable. Manual credit check is required.")
        console.error("Credit Bureau API is unavailable.")
      } else if (incompleteData) {
        setRetrievedScore('N/A')
        setRetrievalStatus('warning')
        setWarning("Bureau API returned incomplete data. Manual verification prompted.")
        console.warn("Bureau API returned incomplete data.")
      } else {
        const score = Math.floor(Math.random() * (850 - 300 + 1)) + 300
        setRetrievedScore(score)
        setRetrievalStatus('success')
        console.log("Credit score retrieved:", score)
      }
    }, 2000)
  }

  return (
    <div className="credit-check-integration-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "CreditScoreRetrievalFeature" && (
            <CreditScoreRetrievalFeature
              task={story.tasks[0]}
              applicantDetails={applicantDetails}
              onDetailsChange={handleDetailsChange}
              onRetrieveScore={handleRetrieveScore}
              retrievedScore={retrievedScore}
              retrievalStatus={retrievalStatus}
              warning={warning}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default CreditCheckIntegrationPage