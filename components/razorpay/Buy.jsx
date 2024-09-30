"use client";
import React, { useState } from "react";

const Buy = ({ makePayment }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          makePayment({ productId: "example_ebook" });
        }}
        disabled={isLoading}
        className={`bg-green-500 text-white font-semibold mt-20 py-2 px-4 rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Processing..." : "Book Appointment"}
      </button>
    </>
  );
};

export default Buy;
