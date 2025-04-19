import { FC } from 'react';
import { Landmark, Github, Twitter, Mail } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Landmark className="h-6 w-6 text-primary-500" />
              <span className="font-bold text-lg">LandChain</span>
            </div>
            <p className="text-text-secondary text-sm">
              Secure and transparent land registry powered by StarkNet blockchain technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} LandChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};