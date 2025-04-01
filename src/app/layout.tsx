import { Geist, Geist_Mono } from "next/font/google";
import { SessionNavBar, Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
import Link from "next/link";
import Image from "next/image";

import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Management",
  description: "Stock Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <body>
    <div className="flex h-screen w-screen flex-row">
    <SessionNavBar />
    <main className="flex h-screen grow flex-col overflow-auto">
                {children}
    
    </main>
    </div>

    </body>
  </html>
  );
}
