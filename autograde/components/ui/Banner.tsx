// autograde/components/ui/DarkBanner.tsx
import React from 'react';
import './Banner.css'; // Import the CSS file

const DarkBanner: React.FC = () => {
  return (
    <div className="banner">
      <h1>Automated Exam Evaluation System</h1>
      <p>Streamline your grading process with our intelligent evaluation system</p>
      <div className="features">
        <span>⏱️ Fast Processing</span>
        <span>🔒 Secure System</span>
        <span>📄 Accurate Results</span>
      </div>
    </div>
  );
};

export default DarkBanner;