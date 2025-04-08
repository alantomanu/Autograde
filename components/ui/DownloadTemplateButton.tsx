import React from 'react';
import { motion } from 'framer-motion';

interface DownloadTemplateButtonProps {
    templateUrl: string;
    fileName: string;
  }
  
  export function DownloadTemplateButton({ templateUrl, fileName }: DownloadTemplateButtonProps) {
    return (
      <motion.a 
        href={templateUrl}
        className="absolute top-[-.5rem] right-2 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 hover:scale-105 group"
        download={fileName}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.svg 
          className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          initial={{ y: 0 }}
          animate={{ y: [0, -2, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </motion.svg>
        <span className="relative">
          Download Template
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
        </span>
      </motion.a>
    );
  }