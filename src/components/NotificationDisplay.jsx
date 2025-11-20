import React, { useState, useEffect } from 'react'

function NotificationDisplay({ message, type, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration])

  if (!isVisible || !message) {
    return null
  }

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  )
}

export default NotificationDisplay