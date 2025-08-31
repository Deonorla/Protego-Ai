"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight, ScrollText, ShieldCheck, FileText } from "lucide-react";

// Trustworthy spinner component
const SecuritySpinner = () => (
  <div className="relative">
    <div className="w-6 h-6 border-2 border-slate-600 border-t-green-400 rounded-full animate-spin" />
    <ShieldCheck className="absolute inset-0 w-6 h-6 text-green-400 animate-pulse" />
  </div>
);

interface ChatSession {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: string;
  preview: string;
  isFromAgent: boolean;
  channelId?: string;
}

interface ChatSessionsProps {
  userId: string | null;
  currentSessionId?: string;
  showSwitcher?: boolean;
}

export const ChatSessions = ({
  userId,
  currentSessionId,
  showSwitcher = false,
}: ChatSessionsProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/chat-sessions?userId=${encodeURIComponent(userId)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch previous analyses");
        }

        setSessions(data.data?.sessions || []);
      } catch (err) {
        console.error("[SecureSessions] Error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load previous analyses",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const handleSessionClick = (session: ChatSession) => {
    // Navigate to the secure session
    router.push(`/chat/${session.id}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <SecuritySpinner />
          <span className="text-slate-400 animate-pulse flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Scanning previous data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5" />
        <div className="relative z-10 text-center">
          <div className="text-red-400 text-2xl mb-2">🚨⚠️</div>
          <p className="text-red-300 font-medium">Data connection error!</p>
          <p className="text-red-400/80 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block mb-4">
          <FileText className="w-16 h-16 text-slate-600 mx-auto" />
        </div>
        <p className="text-slate-400 text-lg font-medium mb-2">
          {showSwitcher
            ? "No other analysis sessions found"
            : "Your history is clear"}
        </p>
        <p className="text-slate-500 text-sm">
          {showSwitcher 
            ? "Start a new analysis above to begin" 
            : "Start by analyzing a protocol or checking a contract for vulnerabilities."}
        </p>
      </div>
    );
  }

  const filteredSessions = showSwitcher
    ? sessions.filter((s) => s.id !== currentSessionId)
    : sessions;

  if (showSwitcher && filteredSessions.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-slate-500 text-sm flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          No other analysis sessions found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSwitcher && (
        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          Switch to another session:
        </h3>
      )}

      <div className="space-y-3">
        {filteredSessions.map((session, index) => (
          <div
            key={session.id}
            onClick={() => handleSessionClick(session)}
            className="group cursor-pointer bg-slate-900/50 hover:bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/40 rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02] relative overflow-hidden backdrop-blur-sm"
          >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <h4 className="font-semibold text-slate-200 group-hover:text-teal-300 transition-colors text-sm line-clamp-1">
                    {session.title}
                  </h4>
                </div>
                
                {session.preview && (
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2 pl-6">
                    {session.isFromAgent && (
                      <span className="inline-flex items-center gap-1 mr-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      </span>
                    )}
                    {session.preview}
                  </p>
                )}
                
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 pl-6">
                  <div className="flex items-center gap-1">
                    <ScrollText className="w-3 h-3" />
                    <span>
                      {session.messageCount} message{session.messageCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(session.lastActivity)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-teal-500/20 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSessions;