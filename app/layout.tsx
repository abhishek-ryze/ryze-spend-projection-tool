import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales & Marketing Spend Projection Tool | Ryze",
  description: "Model your go-to-market spend across 6 channels with real-time Bear, Base, and Bull scenario projections.",
  openGraph: {
    title: "Sales & Marketing Spend Projection Tool",
    description: "Model your GTM spend across 6 channels with real-time Bear, Base, and Bull scenario projections.",
    siteName: "Ryze Design Studio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Mohave:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
