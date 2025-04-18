import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-900 border-t border-gray-800 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center">
          <span className="gradient-text font-medium">My Playlist Finder</span>
          <span className="text-white"> © {new Date().getFullYear()}</span>
        </p>
        <div className="flex justify-center mt-2 space-x-4 text-sm">
          <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 