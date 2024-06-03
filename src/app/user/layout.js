"use client";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, AuthContext } from "@/app/user/context/auth-context";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import { Saidbar } from "./user_components/Saidbar";
import Header from "./user_components/Header";
import { useContext, useEffect } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthenticatedApp>{children} </AuthenticatedApp>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthenticatedApp({ children }) {
  const { isAuthenticated, checkauth } = useContext(AuthContext);

  useEffect(() => {
    checkauth();
  }, [checkauth]);

  const gridClass = isAuthenticated
    ? "grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
    : "grid min-h-screen w-full";

  return (
    <div className={gridClass}>
      {isAuthenticated && <Saidbar /> }
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

