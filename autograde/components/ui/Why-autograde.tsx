import React from 'react';
import './Why-autograde.css'; // Import the CSS file

const EvaluationSection: React.FC = () => {
  return (
    <div className="evaluation-section">
      <h2>Why Choose Our Evaluation System?</h2>
      <div className="cards">
        <div className="card">
          <div className="icon">📊</div>
          <h3>Automated Processing</h3>
          <p>Fast and accurate evaluation of answer sheets using advanced algorithms.</p>
        </div>
        <div className="card">
          <div className="icon">📈</div>
          <h3>Comprehensive Reports</h3>
          <p>Detailed analysis and insights for each evaluation.</p>
        </div>
        <div className="card">
          <div className="icon">🕒</div>
          <h3>24/7 Support</h3>
          <p>Round-the-clock assistance for all your evaluation needs.</p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSection;
