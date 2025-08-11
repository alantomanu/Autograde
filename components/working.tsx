"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, FileText, Brain, TrendingUp, Zap, Shield, Users, BarChart3 } from 'lucide-react';

interface ProgressiveTextRevealProps {
  text: string;
  isActive: boolean;
  progress: number;
}

const ProgressiveTextReveal = ({ text, isActive, progress }: ProgressiveTextRevealProps) => {
  const words = text.split(' ');
  const visibleWords = Math.floor(words.length * progress);

  return (
    <div className="text-gray-600 leading-relaxed">
      {words.map((word, index) => (
        <span
          key={index}
          className={`transition-all duration-300 ${
            index < visibleWords ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {word}
          {index < words.length - 1 && ' '}
        </span>
      ))}
    </div>
  );
};

export default function SystemWorkflow() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [sectionProgress, setSectionProgress] = useState<number[]>([0, 0, 0]);
  const sectionRefs = [
    useRef<HTMLDivElement>(null), 
    useRef<HTMLDivElement>(null), 
    useRef<HTMLDivElement>(null)
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      
      let newSectionProgress = [0, 0, 0];
      let newActiveSection: number | null = null;
      let totalProgressPercentage = 0;
      
      sectionRefs.forEach((ref, index) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          const positionInViewport = (viewportHeight - rect.top) / (viewportHeight + rect.height);
          
         
          const progress = Math.max(0, Math.min(1, Math.pow((positionInViewport - 0.2) * 1.5, 0.8)));
          
          newSectionProgress[index] = progress;
          
          if (progress > 0.1 && (newActiveSection === null || index > newActiveSection)) {
            newActiveSection = index;
          }
        }
      });
      
      
      if (newActiveSection !== null) {
        const sectionWeight = 33.33;
        let totalProgress = 0;
        
        
        for (let i = 0; i < newActiveSection; i++) {
          totalProgress += sectionWeight;
        }
        
      
        const currentProgress = newSectionProgress[newActiveSection];
        totalProgress += (Math.pow(currentProgress, 0.8)) * sectionWeight;
        
        
        if (newActiveSection > 0) {
          totalProgress += Math.min(currentProgress, 0.3) * sectionWeight * 0.6;
        }
        
        totalProgressPercentage = totalProgress;
      }
      
 
      setSectionProgress(newSectionProgress);
      setActiveSection(newActiveSection);
      setScrollProgress(totalProgressPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Remove sectionRefs from dependencies since refs are stable

  return (
    <div  id="working-section" className="w-full py-8 sm:py-12 px-4 sm:px-6 md:px-8 relative" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            How AutoGrade <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">works ?</span>
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl">
            Powered by advanced LLaMA models for intelligent assessment
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[1.5rem] sm:left-[2.35rem] top-[3rem] w-1 sm:w-1.5 h-[calc(100%-20rem)] sm:h-[calc(100%-15rem)] bg-gray-200 rounded-full">
            <div 
              className="absolute top-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          <div 
            ref={sectionRefs[0]}
            className="flex items-start space-x-4 sm:space-x-8 p-4 sm:p-6 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <FileText className="text-white" size={23} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Answer Sheet Processing</h3>
              <ProgressiveTextReveal 
                text="Autograde seamlessly converts the PDF answer sheets into high-quality images and processes them using state-of-the-art Meta LLaMA 3.2 90B vision model for precise text recognition." 
                isActive={activeSection !== null && activeSection >= 0} 
                progress={sectionProgress[0]} 
              />
            </div>
          </div>

          <div 
            ref={sectionRefs[1]}
            className="flex items-start space-x-4 sm:space-x-8 p-4 sm:p-6 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
                <Brain className="text-white" size={23} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Advanced Assessment</h3>
              <ProgressiveTextReveal 
                text="Harnessing the intelligence of Meta LLaMA 3.3 70B, AutoGrade revolutionizes assessment by evaluating answers with deep, human-like understanding  delivering instant, accurate, and consistent grading at scale, all based on your provided answer key." 
                isActive={activeSection !== null && activeSection >= 1} 
                progress={sectionProgress[1]} 
              />
            </div>
          </div>

          <div 
            ref={sectionRefs[2]}
            className="flex items-start space-x-4 sm:space-x-8 p-4 sm:p-6 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle className="text-white" size={23} />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Instant Results</h3>
              <ProgressiveTextReveal 
                text="Get immediate results with detailed explanations highlighting where and why marks were lost provided right after the teacher submits the evaluation, empowering students with actionable feedback for continuous improvement" 
                isActive={activeSection !== null && activeSection >= 2} 
                progress={sectionProgress[2]} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}