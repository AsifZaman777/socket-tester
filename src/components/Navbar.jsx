import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center shadow-sm shadow-green-200 ">
      {/* App Name */}
      <h1 className="text-xl font-semibold">Socket Tester</h1>
    </nav>
  );
};

export default Navbar;
