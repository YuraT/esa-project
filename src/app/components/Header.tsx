import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="mb-10 w-full h-[15vh] flex items-center justify-center bg-[#275c9d]">
      <div className="absolute left-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#678dc9] cursor-pointer">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Header;
