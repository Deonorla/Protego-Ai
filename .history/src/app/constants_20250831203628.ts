export const siteConfig = {
  name: "Protego Ai",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://ai.eliza.how/" ||
    "http://localhost:4000",
  description:
    "Eliza is a powerful multi-agent simulation framework designed to create, deploy, and manage autonomous AI agents.",
  ogImage: "/favicon.ico",
  creator: "Eliza Labs",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/logo.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/logo.svg",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};
