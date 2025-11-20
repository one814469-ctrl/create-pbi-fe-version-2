import React from 'react'
import { Link } from 'react-router-dom'
import epics from '../data/epics.json'

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Swan Mauritius Loan Portal</h1>
      <p>Your digital self-service channel for all your loan application and management needs.</p>

      <section className="card">
        <h2 className="section-title">Our Services</h2>
        <div className="service-grid">
          {epics.map(epic => (
            <div key={epic.title} className="service-item">
              <h3>{epic.title}</h3>
              <p>{epic.description}</p>
              <Link to={epic.route} className="button">Explore {epic.title}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">About Swan Mauritius</h2>
        <p>
          Swan Mauritius is committed to providing excellent financial services. Our new digital portal aims to streamline your experience, making loan applications and management easier and more transparent than ever before.
        </p>
      </section>
    </div>
  )
}

export default HomePage