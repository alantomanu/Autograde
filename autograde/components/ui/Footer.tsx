import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import {  TbScan, TbRobot } from 'react-icons/tb';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-white text-gray-800 py-10 ${className}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
            <Image
            src="/logoblack.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                AutoGrade
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Revolutionizing exam evaluation with AI-powered automation. Making assessment easier and more efficient for educators worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/alantomanu" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/alanto-manu" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alantomanu501@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 px-16">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2">
                  Evaluvator
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Documentation</h3>
            <div className="space-y-4">
              <a 
                href="https://drive.google.com/file/d/1lnIWA2PFKcqA4fMAuq1mPCYRl4wXiKbG/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HiDocumentText size={24} className="text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-800">View Documentation</h4>
                    <p className="text-sm text-gray-600">Get started with AutoGrade</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* API Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Our APIs</h3>
            <div className="space-y-4">
              <a 
                href="https://autograde-server.onrender.com/perform-ocr"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TbScan size={24} className="text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-800">OCR API</h4>
                    <p className="text-sm text-gray-600">Convert pdf to text</p>
                  </div>
                </div>
              </a>
              <a 
                href="https://autograde-server.onrender.com/evaluate"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TbRobot size={24} className="text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-800">Evaluation API</h4>
                    <p className="text-sm text-gray-600">Grade answers </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm text-center">
              © {new Date().getFullYear()} AutoGrade. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;