import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import {  TbScan, TbRobot } from 'react-icons/tb';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '../../config';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-white  py-6 sm:py-10 w-full ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start">
            <div className="flex items-center space-x-3">
              <Image
                src="/logoblack.png"
                alt="Logo"
                width={35}
                height={35}
                className="object-contain w-[35px] h-[35px]"
                priority
              />
              <h2 className="text-xl sm:text-2xl font-bold  ">
                AutoGrade
              </h2>
            </div>
            <p className="text-sm sm:text-base  leading-relaxed text-center sm:text-left">
              Revolutionizing exam evaluation with AI-powered automation. Making assessment easier and more efficient for educators worldwide.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="https://github.com/alantomanu" target="_blank" rel="noopener noreferrer" className=" hover:text-black transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/alanto-manu" target="_blank" rel="noopener noreferrer" className=" hover:text-black transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alantomanu501@gmail.com" target="_blank" rel="noopener noreferrer" className=" hover:text-black transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left sm:mx-0">
            <h3 className="text-lg font-semibold ">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className=" hover: transition-colors">
                  Evaluvator
                </Link>
              </li>
              <li>
                <Link href="/" className=" hover: transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/analytics" className=" hover: transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div className="space-y-4 w-full">
            <h3 className="text-lg font-semibold  text-center sm:text-left">Documentation</h3>
            <div className="space-y-3">
              <a 
                href="https://drive.google.com/file/d/1lnIWA2PFKcqA4fMAuq1mPCYRl4wXiKbG/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 sm:p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HiDocumentText size={20} className="text-blue-600" />
                  <div>
                    <h4 className="font-medium  text-sm sm:text-base">View Documentation</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Get started with AutoGrade</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* API Section */}
          <div className="space-y-4 w-full">
            <h3 className="text-lg font-semibold  text-center sm:text-left">Our APIs</h3>
            <div className="space-y-3">
              <a 
                href={config.api.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 sm:p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TbScan size={20} className="text-purple-600" />
                  <div>
                    <h4 className="font-medium  text-sm sm:text-base">OCR API</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Convert pdf to text</p>
                  </div>
                </div>
              </a>
              <a 
                href={config.api.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 sm:p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TbRobot size={20} className="text-green-600" />
                  <div>
                    <h4 className="font-medium  text-sm sm:text-base">Evaluation API</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Grade answers</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 w-full">
          <div className="text-gray-600 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} AutoGrade. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;