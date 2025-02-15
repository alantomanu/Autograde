"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { Gauge, BarChart2, Clock } from "lucide-react"; // Importing Lucide icons

const EvaluationSection: React.FC = () => {
  return (
    <div className="evaluation-section">
      <h2 className="text-xl font-bold text-center mb-6">Why Choose Our Evaluation System?</h2>
      <div className="cards flex flex-wrap justify-center gap-6">
        
        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <Gauge className="icon text-4xl mx-auto" /> {/* Centered Lucide icon, increased size */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 text-center">Automated Processing</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Fast and accurate evaluation of answer sheets using advanced algorithms.
            </p>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <BarChart2 className="icon text-4xl mx-auto" /> {/* Centered Lucide icon, increased size */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 text-center">Comprehensive Reports</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Detailed analysis and insights for each evaluation.
            </p>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <Clock className="icon text-4xl mx-auto" /> {/* Centered Lucide icon, increased size */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 text-center">24/7 Support</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Round-the-clock assistance for all your evaluation needs.
            </p>
          </BackgroundGradient>
        </div>

      </div>
    </div>
  );
};

export default EvaluationSection;