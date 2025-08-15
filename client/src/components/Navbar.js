import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Home, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">F</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">Form Builder</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <Link
              to="/builder"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                isActive('/builder')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Form</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




