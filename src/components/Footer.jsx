import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaWhatsapp,
} from "react-icons/fa"; // Icons for social media
import { IoCode } from "react-icons/io5";
import { SiGmail } from "react-icons/si"; // Gmail icon

const Footer = () => {
  return (
    <div className="p-4 bg-neutral-950 border-t-2 border-green-400 text-white text-center">
      <div className="flex flex-wrap justify-center items-center space-x-4 text-sm">
        {/* Project Name */}
        <span className="text-green-200 font-semibold">
          Websocket Health Monitor
        </span>

        {/* Developer Info */}
        <span className="flex items-center">
          <IoCode className="text-xl text-green-300" />{" "}
          {/* Adjust size if needed */}
          <span className="font-semibold ml-1 text-green-400">Asif Zaman</span>
        </span>

        {/* Contact Info */}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=asif.zaman@lbsbd.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-green-300 transition-colors duration-200"
        >
          <SiGmail className="mr-1" />
          Contact
        </a>

      </div>
    </div>
  );
};

export default Footer;
