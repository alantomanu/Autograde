// autograde/components/ui/DarkBanner.tsx
import React from 'react';
import { Clock, Lock, FileText } from 'lucide-react'; // Import Lucide icons
import './Banner.css'; // Import the CSS file

const DarkBanner: React.FC = () => {
  return (
    <div className="banner bg-white dark:bg-black py-12">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Automated Exam Evaluation System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Streamline your grading process with our intelligent evaluation system
        </p>
        <div className="flex justify-center space-x-8">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Clock className="w-6 h-6 mr-2 text-teal-500" /> {/* Teal accent color */}
            <span>Fast Processing</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Lock className="w-6 h-6 mr-2 text-teal-500" /> {/* Teal accent color */}
            <span>Secure System</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <FileText className="w-6 h-6 mr-2 text-teal-500" /> {/* Teal accent color */}
            <span>Accurate Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkBanner;