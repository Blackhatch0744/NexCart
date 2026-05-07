import React from "react";

export default function AuthButton({ icon: Icon, text, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center justify-center gap-3
        w-full h-12
        rounded-xl
        border border-white/20
        bg-white/10 backdrop-blur-md
        hover:bg-white/20
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      <span className="tracking-wide">{text}</span>
    </button>
  );
}
