import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Visibility Score | Analyze Your Healthcare Brand",
  description: "Instantly analyze your visibility across Google and AI-powered search ecosystems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col" style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
