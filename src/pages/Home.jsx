import React from 'react';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import epics from '../data/epics.json';
import { slugify } from '../utils/helpers';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Card title="Welcome to the FinTrust Loan Application Portal">
        <p className="portal-tagline">Your seamless digital journey for financial growth.</p>
        <p>
          This portal allows customers to apply for loans digitally, track their application status, and manage their documents.
          For internal staff, it provides a comprehensive dashboard to manage applications, perform automated checks, and generate reports.
        </p>
        <div className="home-actions">
          <Button onClick={() => navigate(`/epic/${slugify(epics[0].title)}`)}>
            Start Your Journey
          </Button>
          <Button onClick={() => navigate('/epic/internal-loan-management-dashboard')} variant="secondary">
            Access Employee Dashboard
          </Button>
        </div>
      </Card>

      <div className="key-features-section">
        <h2 className="section-header">Key Features at a Glance</h2>
        <div className="feature-cards">
          {epics.map((epic, index) => (
            <Card key={index} className="feature-card">
              <h3>{epic.title}</h3>
              <p>{epic.description}</p>
              <Button onClick={() => navigate(`/epic/${slugify(epic.title)}`)} variant="tertiary">
                Learn More
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;