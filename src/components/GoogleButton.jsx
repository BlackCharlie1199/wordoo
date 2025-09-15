// GoogleButton.jsx
import React from "react";

export const GoogleSignInButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 transition"
    >
      {/* Google "G" logo (SVG) */}
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="#EA4335"
          d="M488 261.8c0-17.4-1.6-34-4.6-50.2H249v95h134.1c-5.8 31.2-23.5 57.7-50.3 75.5v62h81.3c47.6-43.8 74.9-108.2 74.9-182.3z"
        />
        <path
          fill="#34A853"
          d="M249 492c67.6 0 124.5-22.4 166-61l-81.3-62c-22.6 15.2-51.5 24.2-84.7 24.2-65.2 0-120.4-44.1-140-103.5h-83v64.8C68.2 440.6 151.8 492 249 492z"
        />
        <path
          fill="#4A90E2"
          d="M109 289.7c-4.7-14.1-7.4-29-7.4-44.7s2.7-30.6 7.4-44.7V135h-83C15.5 175.9 0 220.3 0 265c0 44.7 15.5 89.1 41 130l68-65.3z"
        />
        <path
          fill="#FBBC05"
          d="M249 97.5c36.7 0 69.6 12.7 95.6 37.5l71.4-71.4C373.5 24.6 316.6 0 249 0 151.8 0 68.2 51.4 27.1 125l81.9 64.7C128.6 141.6 183.8 97.5 249 97.5z"
        />
      </svg>

      <span className="text-gray-700 font-medium">Sign in with Google</span>
    </button>
  );
};

export const GoogleSignOutButton= ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-black rounded-md bg-white shadow hover:shadow-md transition
                 focus:scale-125"
    >
      {/* Logout icon (Material icon style) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
        />
      </svg>
      <span className="text-gray-700 font-medium">Sign out</span>
    </button>
  );
};