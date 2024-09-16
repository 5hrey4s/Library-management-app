"use client"
import React, { useState, useEffect } from "react";

const TypingSearchInput: React.FC = () => {
  const [displayedText, setDisplayedText] = useState("");
  const placeholderText = "Type"; // The text to be typed out
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    if (typingIndex < placeholderText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + placeholderText[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 200); // Adjust the speed here
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, placeholderText]);

  return (
    <div className="flex items-center shadow-lg">
      <input
        type="text"
        className="flex-grow p-3 rounded-l-full text-gray-500 placeholder-gray-400 focus:outline-none"
        placeholder={displayedText}
      />
      <button
        className="p-3 bg-green-600 text-white rounded-r-full focus:outline-none"
      >
        Search
      </button>
    </div>
  );
};

export default TypingSearchInput;
