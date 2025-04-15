'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Lock, FileText, Sparkles, CheckCircle2, Scan, FileSearch } from 'lucide-react';
import { RetroGrid } from "@/components/magicui/retro-grid";
import Link from "next/link";
import { useSession } from "next-auth/react";

const AutoGradingAnimation = () => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-12 bg-gradient-to-br from-violet-500 to-indigo-800 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full flex flex-wrap">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="text-white/10 font-mono text-xs"
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.07,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['✨', '⭐', '✓', '★', '✦'][i % 5]}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center relative z-10">
        <div className="relative mb-4">
          {/* Outer rings */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 md:w-24 h-16 md:h-24 rounded-full bg-white/5 animate-pulse" />
            <div className="absolute w-16 md:w-24 h-16 md:h-24 rounded-full border-2 border-white/20" style={{
              transform: `rotate(${animationProgress * 3.6}deg)`,
              transition: 'transform 0.1s linear'
            }} />
            
            {/* Main icon container */}
            <div className="relative group">
              <div className="flex items-center justify-center">
                <div className="relative transform transition-transform duration-500 hover:scale-110">
                  {/* Scanning effect layers */}
                  <div className="absolute inset-0 animate-scan-vertical">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
                  </div>
                  <div className="absolute inset-0 animate-scan-horizontal">
                    <div className="w-1 h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent" />
                  </div>
             
                  <FileSearch className="w-12 h-14 text-white animate-float relative z-10" />
                  
                  <div className="absolute -inset-3">
                    <div className="w-full h-full rounded-full border-2 border-indigo-400/20 animate-scan-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
          <CheckCircle2 className="w-5 h-5 text-green-300 absolute -bottom-1 -left-1 md:-left-4 animate-bounce" />
        </div>

        <div className="text-white font-bold text-xl mt-2">LlaMa Powered</div>
        <div className="text-purple-100 text-lg font-medium">Evaluation</div>
        
        {/* Loading dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-ping" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-purple-400/50 animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scan-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 2s linear infinite;
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 2s linear infinite;
        }
        .animate-scan-pulse {
          animation: scan-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const ModernBanner: React.FC = () => {
  const { data: session } = useSession();

  const scrollToEvaluator = () => {
    const evaluatorSection = document.getElementById('evaluator-section');
    if (evaluatorSection) {
      evaluatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-8 md:py-16 overflow-hidden bg-background w-full">
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
                  className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Evaluate Now
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
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
              <AutoGradingAnimation />
              
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