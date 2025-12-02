"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-purple-500/40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              ज्योतिष परामर्श
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-purple-100 hover:bg-purple-900/40">
                डैशबोर्ड लॉगिन
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-white/10" asChild>
              <a href="tel:9767773236">संपर्क करें</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}