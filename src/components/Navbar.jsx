import React from "react";
import { FaGithub, FaLinkedin, FaInfoCircle, FaHome, FaChartLine } from "react-icons/fa"; // Icons for navigation and social media

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center shadow-sm shadow-green-200">
      {/* Left Section: App Name and Description */}
      <div className="flex justify-between items-center space-x-4">
        <h1 className="text-xl font-semibold text-green-200">Socket Health Monitor</h1>
        <p className="text-xs text-gray-300 hidden md:block">
          A real-time socket monitoring tool.
        </p>
      </div>


    </nav>
  );
};

export default Navbar;