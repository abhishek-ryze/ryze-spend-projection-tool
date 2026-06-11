import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTM Spend Projection Tool | Ryze",
  description: "Allocate sales & marketing spend across any channel and project customers, CAC, LTV:CAC, MRR/ARR and ROI over 12 months. Built for startup founders.",
  openGraph: {
    title: "GTM Spend Projection Tool",
    description: "Turn marketing spend into customers, CAC, MRR and ROI, projected over 12 months. Built for founders sizing up go-to-market.",
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
