import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-gray-900 dark:text-white py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">AutoGrade</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Making exam evaluation easier and more efficient for educators worldwide.
            </p>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Updates</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Team</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;