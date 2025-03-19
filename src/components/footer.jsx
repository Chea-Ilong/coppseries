import React from 'react';

const Footer = () => {
  return (
    <div className="w-full bg-bg-primary">
      <footer className="mx-auto max-w-screen-xl p-4 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Logo and Navigation Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
            <img 
                src="src\assets\CS-logo-removebg-preview.png" 
                className="h-12 w-auto transition-all duration-300"
                style={{ filter: 'var(--logo-filter)' }}
                alt="CoppSeries Logo" 
              />
              {/* <span className="text-xl md:text-2xl font-semibold text-primary">
                CoppSeries
              </span> */}
            </a>

            {/* Navigation */}
            <nav>
              <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium text-secondary">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Licensing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Copyright */}
          <div className="text-center">
            <span className="text-sm text-secondary">
              © {new Date().getFullYear()}{' '}
              <a 
                href="https://chea-ilong.github.io/khonnect/" 
                className="hover:text-accent transition-colors"
              >
                CoppSeries™
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;