"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { Gauge, BarChart2, FileSpreadsheet } from "lucide-react"; // Importing Lucide icons

const EvaluationSection: React.FC = () => {
  return (
    <div className="evaluation-section mb-10">
      <h2 className="text-xl font-bold text-center mb-10">Why Choose Our Evaluation System?</h2>
      <div className="cards flex flex-wrap justify-center gap-6">
        
        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white">
            <Gauge className="icon text-4xl mx-auto" /> {/* Centered Lucide icon, increased size */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 text-center">Automated Processing</h3>
            <p className="text-sm text-neutral-600 text-center">
              Fast and accurate evaluation of answer sheets using advanced algorithms.
            </p>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white">
            <BarChart2 className="icon text-4xl mx-auto" /> {/* Centered Lucide icon, increased size */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 text-center">Comprehensive Reports</h3>
            <p className="text-sm text-neutral-600 text-center">
              Detailed analysis and insights for each evaluation.
            </p>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white">
            <FileSpreadsheet className="icon text-4xl mx-auto" /> {/* Excel/Spreadsheet icon */}
            <h3 className="text-base sm:text-xl text-black mt-4 mb-2 text-center">Export Results</h3>
            <p className="text-sm text-neutral-600 text-center">
              Download evaluation results in XLS format for easy analysis and record-keeping.
            </p>
          </BackgroundGradient>
        </div>

      </div>
    </div>
  );
};

export default EvaluationSection;