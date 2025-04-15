'use client';

import React from 'react';
import { Clock, Lock, FileText, BarChart2 } from 'lucide-react';
import { RetroGrid } from "@/components/magicui/retro-grid";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ModernBanner: React.FC = () => {
  const { data: session } = useSession();

  const scrollToEvaluator = () => {
    const evaluatorSection = document.getElementById('evaluator-section');
    if (evaluatorSection) {
      evaluatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-16 overflow-hidden bg-background w-full">
      <RetroGrid className="absolute inset-0" />
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-8">
          {/* Left side content */}
          <div className="w-full md:w-1/2 text-left mb-10 md:mb-0 md:pl-8 lg:pl-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-900 mb-4">
              Automated Exam
              <span className="block text-purple-700">Evaluation System</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Streamline your grading process with our intelligent Llama-powered evaluation system that saves time and improves accuracy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center group">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-all">
                  <Clock className="w-5 h-5 text-purple-700" />
                </div>
                <span className="ml-3 text-gray-700">Fast Processing</span>
              </div>
              
              <div className="flex items-center group">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-all">
                  <Lock className="w-5 h-5 text-purple-700" />
                </div>
                <span className="ml-3 text-gray-700">Secure System</span>
              </div>
              
              <div className="flex items-center group">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-all">
                  <FileText className="w-5 h-5 text-purple-700" />
                </div>
                <span className="ml-3 text-gray-700">Accurate Results</span>
              </div>
            </div>
            
            <div className="mt-4">
              {session ? (
                <button
                  onClick={scrollToEvaluator}
                  className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Evaluate Now
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side animation */}
          <div className="w-full md:w-1/2 flex justify-center items-center md:justify-end pr-0 md:pr-8">
            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border-4 border-purple-300 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full border-4 border-indigo-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Center circular content */}
              <div className="absolute inset-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <BarChart2 className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">Llama Powered</div>
                  <div className="text-purple-100 text-sm">Evaluation</div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-0 w-12 h-12 bg-purple-500 rounded-lg animate-bounce opacity-80" style={{ animationDelay: '0.7s', animationDuration: '3s' }}></div>
              <div className="absolute bottom-8 left-0 w-8 h-8 bg-indigo-500 rounded-lg animate-bounce opacity-80" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}></div>
              <div className="absolute top-1/2 right-4 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBanner;