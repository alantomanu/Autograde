"use client";
import React from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { Gauge, BarChart2, FileSpreadsheet } from "lucide-react";

const EvaluationSection: React.FC = () => {
  return (
    <div
      id="features-section"
      className="evaluation-section mb-10 px-4 sm:px-6 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-10 leading-tight text-center">
        Why to choose{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          AutoGrade.
        </span>
      </h2>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ 
            {
              icon: <Gauge className="text-4xl mx-auto" />,
              title: "Automated Processing",
              desc: "Fast and accurate evaluation of answer sheets using advanced algorithms.",
            },
            {
              icon: <BarChart2 className="text-4xl mx-auto" />,
              title: "Detailed Insights",
              desc: "Thorough analysis with clear, actionable insights for every evaluation.",
            },
            {
              icon: <FileSpreadsheet className="text-4xl mx-auto" />,
              title: "Export Results",
              desc: "Download results in XLS format for analysis and record-keeping.",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="relative p-1 rounded-[22px] w-full h-full"
            >
              <BackgroundGradient className="rounded-[22px] p-6 sm:p-8 md:p-10 bg-white h-full flex flex-col justify-between">
                {card.icon}
                <h3 className="text-base sm:text-xl mt-4 mb-2 text-center font-medium">
                  {card.title}
                </h3>
                <p className="text-sm text-center text-gray-600">
                  {card.desc}
                </p>
              </BackgroundGradient>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationSection;
