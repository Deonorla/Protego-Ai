"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSessions } from "@/components/chat-sessions";
import { Shield, Activity, Sparkles } from "lucide-react";

export const LandingChatSessions = () => {
  const [userEntity, setUserEntity] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize user entity on client side only to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEntity = localStorage.getItem("elizaHowUserEntity");
      if (storedEntity) {
        setUserEntity(storedEntity);
      } else {
        const newEntity = uuidv4();
        localStorage.setItem("elizaHowUserEntity", newEntity);
        setUserEntity(newEntity);
      }
      setIsInitializing(false);
    }
  }, []);

  if (isInitializing) {
    return (
      <div className="w-full relative">
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Shield className="w-6 h-6 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-30" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Initializing Secure Session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Professional container with subtle security accent */}
      <div className="relative">
        {/* Subtle professional background with security theme */}
        <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/5 via-slate-50/80 to-emerald-500/5 dark:from-blue-500/10 dark:via-slate-900/80 dark:to-emerald-500/10 rounded-xl blur-sm opacity-60" />
        
        {/* Security border accent - subtle Hogwarts house colors reference */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/20 via-emerald-200/20 to-amber-200/20 dark:from-blue-500/20 dark:via-emerald-500/20 dark:to-amber-500/20 rounded-xl opacity-30" />
        
        {/* Main content container */}
        <div className="relative z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl flex flex-col h-full">
          {/* Professional header bar */}
          <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Secure DeFi Analysis Session
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Active</span>
              </div>
            </div>
          </div>

          {/* Chat sessions content - this is the new scrollable area */}
          <div className="relative p-4 flex-1 overflow-y-auto">
            <ChatSessions userId={userEntity} />
            
            {/* Subtle activity indicator */}
            <div className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentle-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
          }
        }
        
        .relative:hover .z-10 {
          animation: gentle-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingChatSessions;