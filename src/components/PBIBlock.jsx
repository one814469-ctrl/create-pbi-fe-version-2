import React from 'react'

const PBIBlock = ({ title, description, children, type = 'user-story' }) => {
  const className = `pbi-block ${type}`
  return (
    <div className={className}>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  )
}

export default PBIBlock