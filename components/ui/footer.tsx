"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      setIsScrolledToBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`sticky bottom-0 z-50 transition-all duration-300 py-4 text-center ${
        isScrolledToBottom
          ? "bg-[#F0FDF4] text-black"
          : "bg-white text-black shadow-md"
      }`}
      style={{ boxShadow: isScrolledToBottom ? "none" : "0 -2px 10px rgba(0, 0, 0, 0.1)" }}
    >
      &copy; 2024 Acme Library. All rights reserved.
    </div>
  );
}
