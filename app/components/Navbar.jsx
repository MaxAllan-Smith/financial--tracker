/* eslint-disable react/no-unknown-property */
import { Link } from "@remix-run/react";
import { useState } from "react";

export default function Navbar() {
  // State to toggle mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-w-full">
      <nav className="bg-slate-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-800">
              <Link to="/" className="text-2xl font-bold text-white">
                Financial Tracker
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-white hover:text-blue-500">
                Home
              </Link>
              <Link to="/income" className="text-white hover:text-blue-500">
                Income
              </Link>
              <Link to="/saving-tactics" className="text-white hover:text-blue-500">
                Saving Tactics
              </Link>
              <Link to="/contact" className="text-white hover:text-blue-500">
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="focus:outline-none text-white hover:text-blue-500"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, with slide down animation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <Link
            to="/"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Home
          </Link>
          <Link
            to="/income"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Income
          </Link>
          <Link
            to="/saving-tactics"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Saving Tactics
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Contact
          </Link>
        </div>
      </nav>
    </div>
  );
}
