"use client";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { WalletContext } from '@/components/dashboard/MagicalChatWrapper'


import { Button } from "@/components/button";
import { ExamplePrompts } from "@/components/example-prompts";

export const LandingTextarea = () => {  
  const { walletAddress } = useContext(WalletContext);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEntity, setUserEntity] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { push } = useRouter();

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
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const createNewSession = useCallback(
    async (initialMessage: string) => {
      if (!userEntity) {
        console.error("User entity not available");
        return;
      }

      try {
        setIsLoading(true);
        console.log(
          `[Landing] Creating new secure session with message: "${initialMessage}"`,
        );

        const response = await fetch("/api/chat-session/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userEntity,
            initialMessage: initialMessage,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create secure session");
        }

        const result = await response.json();
        const sessionId = result.data.sessionId;

        console.log(`[Landing] Created new secure session: ${sessionId}`);

        // Navigate to the new session
        push(`/chat/${sessionId}`);
      } catch (error) {
        console.error("[Landing] Failed to create new secure session:", error);
        setIsLoading(false);
      }
    },
    [userEntity, push],
  );

  const handleSubmit = useCallback(
    (e: any) => {
      try {
        e?.preventDefault();

        if (!input.trim() || !userEntity) {
          setIsLoading(false);
          return;
        }

        createNewSession(input.trim());
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    [input, userEntity, createNewSession],
  );

  const handlePromptSelect = useCallback(
    (prompt: string) => {
      if (userEntity) {
        createNewSession(prompt);
      }
    },
    [userEntity, createNewSession],
  );

  return (
    <div className="flex flex-col w-full gap-6">
      <span
        data-slot="control"
        className={clsx([
          "relative block w-full group",
          "dark:before:hidden",
          "before:has-[[data-disabled]]:bg-slate-950/5 before:has-[[data-disabled]]:shadow-none",
        ])}
      >
        <div className={clsx([
          "absolute -inset-1 bg-gradient-to-r from-teal-500/30 via-cyan-500/30 to-blue-500/30 rounded-xl blur opacity-0 transition-opacity duration-500",
          isFocused && "opacity-100"
        ])} />
        
        <div
          className={clsx([
            "relative block size-full appearance-none overflow-hidden rounded-xl",
            "text-base/6 text-slate-50 placeholder:text-slate-400 sm:text-sm/6",
            "bg-slate-900/80 backdrop-blur-sm border-2",
            "focus:outline-none transition-all duration-300",
            "hover:bg-slate-900/90",
            isFocused 
              ? "border-cyan-500/60 bg-slate-900/95" 
              : "border-slate-700/50 hover:border-slate-600/60",
          ])}
        >
          <div className="absolute top-3 left-3 flex items-center gap-1 pointer-events-none">
            <Zap className="w-4 h-4 text-cyan-400 opacity-60" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative min-h-[48px] w-full">
              <textarea
                aria-label="Enter your query"
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="⚡ Run a security scan, find an optimal yield strategy, or get a portfolio analysis..."
                className={clsx([
                  "size-full bg-transparent",
                  "relative block size-full appearance-none",
                  "placeholder:text-slate-500 text-slate-100",
                  "resize-none",
                  "focus:outline-none",
                  "scrollbar scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full scrollbar-w-[4px]",
                  "text-base/6 sm:text-sm/6",
                  "border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0",
                  "p-0 pl-12 pr-4 pt-4",
                  "field-sizing-content resize-none",
                  "scrollbar-thin scrollbar-thumb-rounded-md",
                  "max-h-[48vh]",
                ])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex w-full items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span>Secure connection established</span>
                </div>
              </div>
              <Button
                type="submit"
                color={(input ? "teal" : "dark") as "teal" | "dark"}
                disabled={!input || !userEntity || isLoading}
                aria-label="Submit query"
                className={clsx([
                  "size-9 relative overflow-hidden group",
                  input && !isLoading && "hover:shadow-lg hover:shadow-cyan-500/25",
                ])}
              >
                {input && !isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
                )}
                
                <div className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  ) : input ? (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs transition-opacity duration-200 group-hover:opacity-0">Sectumsempra</span>
                      <Zap className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 absolute" />
                    </div>
                  ) : (
                    <ArrowUpIcon className="!h-3 !w-3 !shrink-0" />
                  )}
                </div>
              </Button>
            </div>
          </form>
        </div>
      </span>

      <div className="relative">
        <ExamplePrompts onPromptSelect={handlePromptSelect} walletAddress={walletAddress} />
      </div>
    </div>
  );
};