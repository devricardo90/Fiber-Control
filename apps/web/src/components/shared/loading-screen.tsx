import React from "react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[var(--color-surface)] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Spinner Background */}
        <div className="w-16 h-16 rounded-full border-4 border-white/5"></div>
        {/* Animated Spinner Profile */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Pulse effect */}
        <div className="absolute inset-2 bg-indigo-500/10 rounded-full animate-pulse blur-xl"></div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Fiber Control</h2>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce"></div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Authenticating session</span>
        </div>
      </div>
    </div>
  );
}
