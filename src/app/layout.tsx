import { SessionNavBar } from "@/components/ui/sidebar";
import { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/LandingPage/hero-section";
import { BenefitsSection } from "@/components/LandingPage/benefits-section";
import { CTASection } from "@/components/LandingPage/cta-section";
import { FAQSection } from "@/components/LandingPage/faq-section";
import { FeaturesSection } from "@/components/LandingPage/features-section";
import { PricingSection } from "@/components/LandingPage/pricing-section";
import { Footer } from "react-day-picker";
import { TestimonialsSection } from "@/components/LandingPage/testimonials-section";

export const metadata: Metadata = {
  title: "Stock Management",
  description: "Stock Management",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Navbar />
          </header>
          <SignedIn>
            <div className="flex h-screen w-screen flex-row">
              <SessionNavBar />
              <main className="flex h-screen grow flex-col overflow-auto">
                {children}
              </main>
              <Toaster />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="min-h-screen bg-background">
              <main>
                <HeroSection />
                <BenefitsSection />
                <FeaturesSection />
                <TestimonialsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
              </main>
              <Footer />
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
