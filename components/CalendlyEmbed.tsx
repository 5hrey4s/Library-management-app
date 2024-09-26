// "use client";

// import { useEffect } from "react";

// export default function CalendlyEmbed({
//   calendlyLink,
// }: {
//   calendlyLink: string;
// }) {

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://assets.calendly.com/assets/external/widget.js";
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Add query parameters for name and email

//   const calendlyUrl = `${calendlyLink}`;

//   return (
//     <div className="bg-gray-600 rounded-xl shadow-lg p-6 transition-all duration-300">
//       <div
//         className="calendly-inline-widget"
//         data-url={calendlyUrl}
//         style={{ minWidth: "320px", height: "700px" }}
//       />
//     </div>
//   );
// }

"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

interface CalendlyWidgetProps {
  calendlyLink: string;
  prefill?: { email: string; name: string };
}

const CalendlyEmbed: React.FC<CalendlyWidgetProps> = ({
  calendlyLink,
  prefill,
}) => {
  return (
    <div className="w-full h-[700px]">
      <InlineWidget
        url={calendlyLink}
        styles={{ height: "100%", width: "100%" }}
        prefill={prefill}
      />
    </div>
  );
};

export default CalendlyEmbed;
