import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not Today",
  description: "The ultimate sports calendar to know when you're busy.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    title: "Not Today",
    statusBarStyle: "black-translucent",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
