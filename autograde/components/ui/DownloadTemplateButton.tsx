import React from 'react';

interface DownloadTemplateButtonProps {
    templateUrl: string;
    fileName: string;
  }
  
  export function DownloadTemplateButton({ templateUrl, fileName }: DownloadTemplateButtonProps) {
    return (
      <a 
        href={templateUrl}
        className="absolute top-[-.5rem] right-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
        download={fileName}
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        Download Template
      </a>
    );
  }