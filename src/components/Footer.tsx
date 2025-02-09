import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-sm py-8 text-center border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-8 mb-6">
          <a
            href="https://www.facebook.com/smarthaveninnovation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors
                     relative after:content-[''] after:absolute after:w-full
                     after:h-0.5 after:bg-purple-600 after:bottom-0 after:left-0
                     after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                     after:duration-300"
            onClick={(e) => {
              if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                e.preventDefault();
                window.location.href = 'fb://profile/smarthaveninnovation';
              }
            }}
          >
            Developer
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors
                     relative after:content-[''] after:absolute after:w-full
                     after:h-0.5 after:bg-purple-600 after:bottom-0 after:left-0
                     after:scale-x-0 hover:after:scale-x-100 after:transition-transform
                     after:duration-300"
          >
            About Us
          </a>
        </div>
        <p className="text-gray-600 font-medium">
          Copyright © John {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};