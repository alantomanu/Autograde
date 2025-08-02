"use client"
import { useRef, useState, useEffect } from "react";
import { Brain, FileText, CheckCircle } from "lucide-react";

interface ProgressiveTextRevealProps {
  text: string;
  isActive: boolean;
  progress: number;
}


const ProgressiveTextReveal = ({ text, isActive, progress }: ProgressiveTextRevealProps) => {
  const isInstantResultsSection = text.includes("Get immediate results");
  const words = text.split(" ");
  
  return (
    <div className="flex flex-wrap items-center text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed">
      {words.map((word: string, index: number) => {
        const wordProgress = isActive ? Math.min(1, Math.pow(progress * 6 - index * 0.05, 0.8)) : 0;
        const opacity = Math.max(0.3, wordProgress);
        
        return (
          <span 
            key={index} 
            className="transition-colors duration-700 mr-[0.25em]"
            style={{ 
              color: opacity >= 0.9 ? '#000' : 
                     opacity >= 0.6 ? '#333' : 
                     opacity >= 0.45 ? '#777' : '#aaa'
            }}
          >
            {word}
          </span>
        );
      })}
      {isInstantResultsSection && (
        <a
          href="https://autograde-student.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium group ml-1"
          style={{
            color: isActive && progress > 0.3 ? '#2563eb' : '#aaa',
            transition: 'all 0.7s ease'
          }}
        >
          <span className="border-b-2 border-dotted border-current">
            Autograde-student
          </span>
          <svg
            className="w-5 h-5 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      )}
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
  }, []);

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