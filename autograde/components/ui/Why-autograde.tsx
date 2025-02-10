"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";

const EvaluationSection: React.FC = () => {
  return (
    <div className="evaluation-section">
      <h2 className="text-xl font-bold text-center mb-6">Why Choose Our Evaluation System?</h2>
      <div className="cards flex flex-wrap justify-center gap-6">
        
        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[20px] p-[1px]">
            <BackgroundGradient className="rounded-[20px] max-w-sm p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
              <div className="icon text-3xl">📊</div>
              <h3 className="text-lg font-semibold mt-4 dark:text-white">Automated Processing</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Fast and accurate evaluation of answer sheets using advanced algorithms.
              </p>
            </BackgroundGradient>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[20px] p-[1px]">
            <BackgroundGradient className="rounded-[20px] max-w-sm p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
              <div className="icon text-3xl">📈</div>
              <h3 className="text-lg font-semibold mt-4 dark:text-white">Comprehensive Reports</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Detailed analysis and insights for each evaluation.
              </p>
            </BackgroundGradient>
          </BackgroundGradient>
        </div>

        <div className="relative p-1 rounded-[22px]">
          <BackgroundGradient className="rounded-[20px] p-[1px]">
            <BackgroundGradient className="rounded-[20px] max-w-sm p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
              <div className="icon text-3xl">🕒</div>
              <h3 className="text-lg font-semibold mt-4 dark:text-white">24/7 Support</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Round-the-clock assistance for all your evaluation needs.
              </p>
            </BackgroundGradient>
          </BackgroundGradient>
        </div>

      </div>
    </div>
  );
};

export default EvaluationSection;
