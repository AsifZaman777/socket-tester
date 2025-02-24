import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaWhatsapp,
} from "react-icons/fa"; // Icons for social media
import { SiGmail } from "react-icons/si"; // Gmail icon

const Footer = () => {
  return (
    <div className="p-4 bg-neutral-950 border-t-2 border-green-400 text-white text-center">
      <div className="flex flex-wrap justify-center items-center space-x-4 text-sm">
        {/* Project Name */}
        <span className="text-green-200 font-semibold">
          Socket Health Monitor
        </span>

        {/* Developer Info */}
        <span className="flex items-center">
          Developed with by{" "}
          <span className="font-semibold ml-1">Asif Zaman</span>
        </span>

        {/* Contact Info */}
        <a
          href="mailto:asifzaman3123@gmail.com"
          className="flex items-center text-gray-300 hover:text-green-300 transition-colors duration-200"
        >
          <SiGmail className="mr-1" />
          Contact
        </a>

        {/* Social Media Links */}
        <a
          href="https://www.linkedin.com/in/asif-zaman-b9b881212/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-green-400 transition-colors duration-200"
        >
          <FaLinkedin size={20} />
        </a>

        <a className="text-green-400 hover:text-green-500 transition-colors duration-200">
          <div className="flex">
            <FaWhatsapp size={20} />
            <span className="ml-1">+8801824500704</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Footer;
