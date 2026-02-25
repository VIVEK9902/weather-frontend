import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/10
        shadow-2xl
        p-5
        transition-all duration-300
        hover:scale-[1.03]
        hover:-translate-y-1
        hover:shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        text-white
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-white/90">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}
