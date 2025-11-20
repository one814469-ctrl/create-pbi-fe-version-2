import React, { useState } from 'react'

const EmailSMSNotificationsFeature = ({
  task,
  onSendNotification,
  notificationLog,
  optedOut,
  onToggleOptOut,
  contactDetails,
  onContactChange
}) => {
  const [selectedStatus, setSelectedStatus] = useState('Submitted')
  const [selectedChannels, setSelectedChannels] = useState(['Email', 'SMS'])

  const handleChannelChange = (channel) => {
    setSelectedChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    )
  }

  const handleTriggerNotification = () => {
    onSendNotification(selectedStatus, selectedChannels)
  }

  return (
    <div className="card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <h5>Notification Settings:</h5>
      <div className="form-group">
        <label htmlFor="emailInput">Email Address:</label>
        <input
          type="email"
          id="emailInput"
          name="email"
          value={contactDetails.email}
          onChange={onContactChange}
          placeholder="e.g., customer@example.com"
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneInput">Phone Number:</label>
        <input
          type="text"
          id="phoneInput"
          name="phone"
          value={contactDetails.phone}
          onChange={onContactChange}
          placeholder="e.g., 23051234567"
        />
      </div>

      <div className="form-group">
        <input
          type="checkbox"
          id="optOut"
          checked={optedOut}
          onChange={onToggleOptOut}
        />
        <label htmlFor="optOut" style={{ display: 'inline', marginLeft: '10px' }}>Opt out of all notifications</label>
      </div>

      <hr style={{ margin: '20px 0', borderTop: '1px solid var(--color-muted)' }} />

      <h5>Trigger Mock Notification:</h5>
      <div className="form-group">
        <label htmlFor="statusSelect">Select Status Change:</label>
        <select id="statusSelect" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Documents Required">Documents Required</option>
        </select>
      </div>

      <div className="form-group">
        <label>Channels:</label>
        <div>
          <input
            type="checkbox"
            id="channelEmail"
            checked={selectedChannels.includes('Email')}
            onChange={() => handleChannelChange('Email')}
          />
          <label htmlFor="channelEmail" style={{ display: 'inline', marginLeft: '5px', marginRight: '15px' }}>Email</label>

          <input
            type="checkbox"
            id="channelSMS"
            checked={selectedChannels.includes('SMS')}
            onChange={() => handleChannelChange('SMS')}
          />
          <label htmlFor="channelSMS" style={{ display: 'inline', marginLeft: '5px' }}>SMS</label>
        </div>
      </div>

      <button onClick={handleTriggerNotification}>Send Mock Notification</button>

      <h5 style={{ marginTop: '30px' }}>Notification Log:</h5>
      <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-muted)', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {notificationLog.length === 0 ? (
          <p>No notification events logged yet.</p>
        ) : (
          <ul>
            {notificationLog.map((log, index) => (
              <li key={index} className={`alert alert-${log.type}`} style={{ padding: '8px', marginBottom: '5px', border: 'none' }}>
                [{log.timestamp}] {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default EmailSMSNotificationsFeature