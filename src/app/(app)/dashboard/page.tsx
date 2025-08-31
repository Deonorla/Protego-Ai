"use client";

import { Suspense, useContext } from "react";
import { LandingTextarea } from "@/components/landing-textarea";
import { LandingChatSessions } from "@/components/landing-chat-sessions";
import { SecurityDashboardWrapper} from '@/components/dashboard/MagicalChatWrapper'

export default function Dashboard() {
  return (
    <SecurityDashboardWrapper>
      <main className="flex-1 size-full overflow-hidden flex flex-col relative">
        {/* Subtle, trustworthy background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/3 via-cyan-500/3 to-blue-500/3 pointer-events-none" />
        
        <div className="flex-1 size-full overflow-hidden flex flex-col justify-center items-center gap-8 px-4 md:px-0 relative z-10">
          {/* Main Title */}
          <div className="text-center relative">
            <h1 className="text-3xl xl:text-4xl font-bold text-center tracking-tighter text-pretty relative">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Secure Your DeFi Journey
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            </h1>
            <p className="text-slate-400 mt-4 text-lg">
              Run on-chain scans, analyze protocols, or optimize your portfolio.
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-xl mx-auto w-full">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <Suspense fallback={null}>
                {/* Pass the walletAddress to LandingTextarea */}
                <LandingTextarea />
              </Suspense>
            </div>
          </div>

          {/* Trustworthy Divider */}
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-slate-600" />
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-full backdrop-blur-sm">
              <span className="text-sm text-slate-400">Previous Analyses</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-600 to-slate-600" />
          </div>

          {/* Previous Chat Sessions */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/20 rounded-xl" />
              
              <Suspense fallback={null}>
                <LandingChatSessions />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </SecurityDashboardWrapper>
  );
}