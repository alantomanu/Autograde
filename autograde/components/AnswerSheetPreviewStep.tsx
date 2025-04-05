import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Clock } from 'lucide-react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function AnswerSheetPreviewStep({
  isProcessing,
  extractedText,
  continueChecked,
  setContinueChecked,
  handleExtractAgain,
}: {
  isProcessing: boolean;
  extractedText: { marginNumber: string; answer: string }[];
  continueChecked: boolean;
  setContinueChecked: (checked: boolean) => void;
  handleExtractAgain: () => void;
}) {
  const [showFinalStep, setShowFinalStep] = useState(false);
  const [textGenerated, setTextGenerated] = useState(false);

  // Check for duplicate margin numbers
  const hasDuplicateKeys = extractedText.length > 0 && 
    new Set(extractedText.map(item => item.marginNumber)).size !== extractedText.length;

  const processingSteps = useMemo(() => [
    {
      icon: Cpu,
      title: "Processing Answer Sheet",
      description: "Converting the PDF answer sheet into high-quality PNG images using the PDF Poppler module. In parallel, each answer is processed using Meta LLaMA 3.2 (90B) to recognize handwritten text with advanced precision."
    },
    {
      icon: Clock,
      title: "Almost There!",
      description: "Hang tight! The digital version will be ready in just a few seconds."
    }
  ], []);

  useEffect(() => {
    if (isProcessing) {
      // Reset states when processing starts
      setShowFinalStep(false);
      setTextGenerated(false);

      // Set text as generated after the animation duration (0.5s * number of words)
      const words = processingSteps[0].description.split(" ").length;
      const generationTime = words * 0.2 + 0.5; // 0.2s per word + 0.5s base duration
      
      const textGenerationTimer = setTimeout(() => {
        setTextGenerated(true);
      }, generationTime * 1000);

      // Show final step 8 seconds after text generation is complete
      const finalStepTimer = setTimeout(() => {
        setShowFinalStep(true);
      }, (generationTime + 8) * 1000);

      return () => {
        clearTimeout(textGenerationTimer);
        clearTimeout(finalStepTimer);
      };
    } else {
      setShowFinalStep(false);
      setTextGenerated(false);
    }
  }, [isProcessing, processingSteps]);

  const iconAnimation = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Answer Sheet Preview</h2>

      {isProcessing ? (
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full"
            >
              
              <div className="mt-8 space-y-6">
                <AnimatePresence mode="wait">
                  {!showFinalStep ? (
                    <motion.div
                      key="initial-step"
                      exit={{ opacity: 0, x: -20 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <motion.div
                          {...iconAnimation}
                          className="p-2 bg-indigo-50 rounded-full"
                        >
                          <Cpu className="w-5 h-5 text-indigo-600" />
                        </motion.div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <TextGenerateEffect 
                          words={processingSteps[0].title}
                          className="text-2xl font-bold text-gray-900"
                          duration={0.3}
                        />
                        <TextGenerateEffect 
                          words={processingSteps[0].description}
                          className={cn(
                            "text-lg font-bold text-gray-600 leading-relaxed",
                            textGenerated && "transition-all duration-300"
                          )}
                          duration={0.5}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        key="final-step"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex-shrink-0">
                          <motion.div
                            {...iconAnimation}
                            className="p-2 bg-indigo-50 rounded-full"
                          >
                            <Clock className="w-5 h-5 text-indigo-600" />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">{processingSteps[1].title}</h3>
                          <p className="text-lg font-bold text-gray-500 mt-1">{processingSteps[1].description}</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4 mt-6"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="verify-answers"
                            checked={continueChecked} 
                            onCheckedChange={(checked) => setContinueChecked(checked as boolean)} 
                          />
                          <label
                            htmlFor="verify-answers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have verified the digital answer sheet and confirm it matches the uploaded document
                          </label>
                        </div>
                        <Button 
                          onClick={handleExtractAgain} 
                          disabled={isProcessing}
                          className="mt-2"
                        >
                          Extract Again
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <>
          {hasDuplicateKeys && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: Duplicate question numbers detected. Please click &quot;Extract Again&quot; to retry text extraction.
            </div>
          )}
          <Card className="p-4">
            {extractedText.length > 0 ? extractedText.map(({ marginNumber, answer }, index) => (
              <p key={`${marginNumber}-${index}`}><strong>{marginNumber}:</strong> {answer}</p>
            )) : <p>No text extracted yet.</p>}
          </Card>

          {extractedText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mt-4"
            >
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verify-answers"
                  checked={continueChecked} 
                  onCheckedChange={(checked) => setContinueChecked(checked as boolean)} 
                />
                <label
                  htmlFor="verify-answers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have verified the digital answer sheet and confirm it matches the uploaded document
                </label>
              </div>
              <Button 
                onClick={handleExtractAgain} 
                disabled={isProcessing}
                className="mt-2"
              >
                Extract Again
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
