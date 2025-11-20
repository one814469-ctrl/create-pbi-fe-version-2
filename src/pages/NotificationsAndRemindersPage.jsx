import React, { useState } from 'react'
import PBIBlock from '../components/PBIBlock'
import EmailSMSNotificationsFeature from '../features/notifications/EmailSMSNotificationsFeature'

const NotificationsAndRemindersPage = ({ epic }) => {
  const [notificationLog, setNotificationLog] = useState([])
  const [optedOut, setOptedOut] = useState(false)
  const [contactDetails, setContactDetails] = useState({ email: 'customer@example.com', phone: '23057123456' })

  const handleToggleOptOut = () => {
    setOptedOut(!optedOut)
    addLog(`Notification opt-out preference set to: ${!optedOut ? 'True' : 'False'}`)
  }

  const handleContactChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value })
  }

  const addLog = (message, type = 'info') => {
    setNotificationLog(prev => [...prev, { timestamp: new Date().toLocaleString(), message, type }])
  }

  const sendNotification = (status, chosenChannels) => {
    if (optedOut) {
      addLog(`User opted out. Notification for status '${status}' not sent.`, 'warning')
      return
    }

    if (!contactDetails.email && chosenChannels.includes('Email')) {
      addLog(`Invalid email for status '${status}'. Email notification not sent.`, 'error')
    } else if (contactDetails.email && chosenChannels.includes('Email')) {
      addLog(`Email sent for status '${status}' to ${contactDetails.email}.`, 'success')
    }

    if (!contactDetails.phone && chosenChannels.includes('SMS')) {
      addLog(`Invalid phone for status '${status}'. SMS notification not sent.`, 'error')
    } else if (contactDetails.phone && chosenChannels.includes('SMS')) {
      addLog(`SMS sent for status '${status}' to ${contactDetails.phone}.`, 'success')
    }

    if (!chosenChannels.length) {
      addLog(`No channels selected for status '${status}'.`, 'info')
    }
  }

  return (
    <div className="notifications-and-reminders-page">
      <h1>{epic.title}</h1>
      <p>{epic.description}</p>

      {epic.userStories.map((story) => (
        <PBIBlock key={story.title} title={story.title} description={story.description} type="user-story">
          {story.component === "EmailSMSNotificationsFeature" && (
            <EmailSMSNotificationsFeature
              task={story.tasks[0]}
              onSendNotification={sendNotification}
              notificationLog={notificationLog}
              optedOut={optedOut}
              onToggleOptOut={handleToggleOptOut}
              contactDetails={contactDetails}
              onContactChange={handleContactChange}
            />
          )}
        </PBIBlock>
      ))}
    </div>
  )
}

export default NotificationsAndRemindersPage