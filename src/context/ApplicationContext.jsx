import React, { createContext, useContext, useState, useEffect } from 'react'

const ApplicationContext = createContext()

const generateUniqueId = () => `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const storedApplications = localStorage.getItem('loanApplications')
    return storedApplications ? JSON.parse(storedApplications) : []
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const stored = localStorage.getItem('notificationsEnabled')
    return stored === 'false' ? false : true
  })

  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications))
  }, [applications])

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString())
  }, [notificationsEnabled])

  const addApplication = (applicationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApplication = {
          id: generateUniqueId(),
          applicantName: applicationData.fullName,
          email: applicationData.email,
          loanType: applicationData.loanType,
          amount: applicationData.loanAmount,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          updates: [{ timestamp: new Date().toISOString(), status: 'submitted', message: 'Application submitted.' }],
          documents: [],
          assignedOfficer: null,
          creditScore: null,
          decisionOverride: null,
          overrideJustification: null,
        }
        setApplications((prev) => [...prev, newApplication])
        if (notificationsEnabled) {
          console.log(`Notification sent to ${applicationData.email}: Your application ${newApplication.id} has been submitted.`)
        }
        resolve({ success: true, id: newApplication.id })
      }, 1000)
    })
  }

  const updateApplicationStatus = (appId, newStatus, message, officerId = null, justification = null) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedApp = {
            ...app,
            status: newStatus,
            updates: [...app.updates, { timestamp: new Date().toISOString(), status: newStatus, message }],
          }
          if (newStatus === 'assigned' && officerId) {
            updatedApp.assignedOfficer = officerId
          }
          if (justification) {
            updatedApp.decisionOverride = newStatus
            updatedApp.overrideJustification = justification
          }
          if (notificationsEnabled && (newStatus === 'approved' || newStatus === 'rejected' || newStatus === 'under-review')) {
            console.log(`Notification sent to ${app.email}: Your application ${app.id} status is now ${newStatus}.`)
          }
          return updatedApp
        }
        return app
      })
    )
  }

  const uploadDocuments = (appId, files) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setApplications((prev) =>
          prev.map((app) => {
            if (app.id === appId) {
              const newDocuments = files.map(file => {
                const isCorrupted = Math.random() < 0.2
                const isUnsupported = !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
                let status = 'pending-ocr'
                let verificationMessage = 'Document uploaded, pending OCR verification.'

                if (isUnsupported) {
                  status = 'unsupported-type'
                  verificationMessage = 'Unsupported file type. Please upload JPEG, PNG, or PDF.'
                  reject({ success: false, message: 'Unsupported file type detected.' })
                  return { name: file.name, type: file.type, status: status, message: verificationMessage }
                }

                if (isCorrupted) {
                  status = 'flagged'
                  verificationMessage = 'Document flagged for manual review (OCR failed).'
                } else if (Math.random() < 0.1) {
                  status = 'flagged'
                  verificationMessage = 'OCR confidence low, flagged for manual review.'
                } else {
                  status = 'verified'
                  verificationMessage = 'Document verified by OCR.'
                }

                return { name: file.name, type: file.type, status: status, message: verificationMessage }
              })
              const hasFlaggedDocs = newDocuments.some(doc => doc.status === 'flagged')
              const hasPendingDocs = newDocuments.some(doc => doc.status === 'pending-ocr')

              const newStatus = hasFlaggedDocs ? 'flagged' : (hasPendingDocs ? 'under-review' : 'verified-documents')
              updateApplicationStatus(appId, newStatus, `Documents uploaded. Overall status: ${newStatus}`)

              return {
                ...app,
                documents: [...app.documents, ...newDocuments],
                status: newStatus,
                updates: [...app.updates, { timestamp: new Date().toISOString(), status: newStatus, message: `Documents uploaded. Overall status: ${newStatus}` }]
              }
            }
            return app
          })
        )
        resolve({ success: true, message: 'Documents uploaded for processing.' })
      }, 1500)
    })
  }

  const simulateCreditCheck = (appId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setApplications((prev) => prev.map((app) => {
          if (app.id === appId) {
            const isApiDown = Math.random() < 0.1
            if (isApiDown) {
              console.error('Credit Bureau API is unavailable. Manual credit check required.')
              return {
                ...app,
                creditScore: 'API_UNAVAILABLE',
                updates: [...app.updates, { timestamp: new Date().toISOString(), status: app.status, message: 'Credit score API unavailable. Manual check needed.' }]
              }
            }
            const score = Math.floor(Math.random() * (850 - 300 + 1)) + 300
            const incompleteData = Math.random() < 0.1
            if (incompleteData) {
              return {
                ...app,
                creditScore: `Incomplete (${score})`,
                updates: [...app.updates, { timestamp: new Date().toISOString(), status: app.status, message: `Credit score retrieved (incomplete data): ${score}` }]
              }
            }
            return {
              ...app,
              creditScore: score,
              updates: [...app.updates, { timestamp: new Date().toISOString(), status: app.status, message: `Credit score retrieved: ${score}` }]
            }
          }
          return app
        }))
        resolve({ success: true })
      }, 1200)
    })
  }

  const getCustomerApplications = (email) => {
    return applications.filter(app => app.email === email)
  }

  const toggleNotifications = (enabled) => {
    setNotificationsEnabled(enabled)
  }

  const getApplicationById = (appId) => applications.find(app => app.id === appId)

  return (
    <ApplicationContext.Provider value={{
      applications,
      addApplication,
      updateApplicationStatus,
      uploadDocuments,
      simulateCreditCheck,
      getCustomerApplications,
      notificationsEnabled,
      toggleNotifications,
      getApplicationById
    }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplications = () => useContext(ApplicationContext)