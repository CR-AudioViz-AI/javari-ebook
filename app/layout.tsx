import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRAV eBook Studio | AI-Powered Publishing Platform",
  description: "Create professional, market-ready books with intelligent AI interviews, rich media integration, professional citations, and multi-format export.",
  keywords: ["ebook creator", "AI writing", "book publishing", "audiobook", "epub"],
  authors: [{ name: "CR AudioViz AI, LLC" }],
  openGraph: {
    title: "CRAV eBook Studio",
    description: "Transform your ideas into professional books with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
