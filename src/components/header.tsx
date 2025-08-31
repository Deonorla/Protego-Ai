"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Dialog } from "@/components/dialog";
import { DiscordIcon, XIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link
        href="/explore"
        className={clsx(
          "text-sm font-medium",
          mobile
            ? "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        Explore
      </Link>
      <a
        href="https://docs.eliza.how/"
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "text-sm font-medium flex items-center",
          mobile
            ? "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white",
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        Docs
      </a>
      <a
        href="https://twitter.com/elizaos"
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "text-sm font-medium flex items-center",
          mobile
            ? "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white",
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <XIcon className="h-4 w-4" />
      </a>
      <a
        href="https://discord.gg/elizaos"
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "text-sm font-medium flex items-center",
          mobile
            ? "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white",
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <DiscordIcon className="h-5 w-5" />
      </a>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-black">
    </header>
  );
}
