"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import CenterUnderline from "@/fancy/components/text/underline-center"
import ComesInGoesOutUnderline from "@/fancy/components/text/underline-comes-in-goes-out"
import GoesOutComesInUnderline from "@/fancy/components/text/underline-goes-out-comes-in"
import { saveAs } from 'file-saver'; 

export default function AutoGradeInstructions() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsVisible(true)
    
    const updateStyles = () => {
      if (containerRef.current) {
        
      }
    }
    
    updateStyles()
    window.addEventListener("resize", updateStyles)
    return () => window.removeEventListener("resize", updateStyles)
  }, [])
  
  const downloadSampleAnswerSheet = () => {
    const url = "https://res.cloudinary.com/dfivs4n49/raw/upload/v1741683187/answer_sheets/Answersheet_avg.pdf";
    saveAs(url, "Sample_Answer_Sheet.pdf"); 
  }
  
  const downloadAnswerKeyFormat = () => {
    const url = "https://res.cloudinary.com/dfivs4n49/raw/upload/v1742880576/answer_keys/ggp5o62ztwfngyasnu6g.docx";
    window.open(url, "_blank"); 
  }
  
  const downloadSampleAnswerKey = () => {
    const url = "https://res.cloudinary.com/dfivs4n49/raw/upload/v1741504690/answer_keys/answerkey_best.pdf";
    saveAs(url, "Sample_Answer_Key.pdf"); 
  }
  
  const scrollToEvaluator = () => {
    const evaluatorSection = document.getElementById('evaluator-section');
    if (evaluatorSection) {
      evaluatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 md:px-8 relative" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            How to use <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AutoGrade.</span>
          </h2>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 rounded-lg"
          >
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed whitespace-normal">
              Navigate to the{" "}
              <GoesOutComesInUnderline 
                label="Evaluator Section" 
                direction="right" 
                className="text-blue-700 font-medium inline-block cursor-pointer" 
                onClick={scrollToEvaluator}
              />{" "}
              and provide your student ID and course details. Upload the answer sheet and verify the digital answer sheet. Download the{" "}
              <CenterUnderline 
                label="Sample Answer Sheet" 
                className="text-purple-600 font-medium inline-block" 
                onClick={downloadSampleAnswerSheet} 
              />,{" "}
              check the{" "}
              <ComesInGoesOutUnderline 
                label="Answer Key Format" 
                direction="left" 
                className="text-purple-600 font-medium inline-block" 
                onClick={downloadAnswerKeyFormat} 
              />,{" "}
              and use the{" "}
              <ComesInGoesOutUnderline 
                label="Sample Answer Key" 
                direction="right" 
                className="text-purple-600 font-medium inline-block" 
                onClick={downloadSampleAnswerKey} 
              />{" "}
              to test the AutoGrade system. Upload your answer key, which uses pattern matching and must strictly follow the specified format. Once all answers are evaluated, you can view the results. For diagram-based questions, you will need to manually award marks. Access detailed analytics in the Analytics Page for comprehensive insights into performance.
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}