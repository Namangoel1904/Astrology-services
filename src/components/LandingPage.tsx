"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Star, Users, Clock, Shield } from "lucide-react";
import AstrologerSlideshow from "@/components/AstrologerSlideshow";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/neural-network-hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <Hero
        title="जहां ज्योतिष मिलता है आधुनिक तकनीक से।"
        description="एक न्यूरल कैनवास के साथ आधुनिक हीरो — सटीक, सुरुचिपूर्ण और प्रभावशाली। React, Three.js और कस्टम CPPN shader से निर्मित।"
        badgeText="Generative Surfaces"
        badgeLabel="New"
        ctaButtons={[
          { text: "अभी शुरू करें", href: "#get-started", primary: true },
          { text: "शोकेस देखें", href: "#showcase" },
        ]}
        microDetails={["सुक्ष्म मोशन", "रेस्पॉन्सिव", "हाई-परफॉर्मेंस"]}
      />

      {/* Astrologers Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              हमारे{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                विशेषज्ञ ज्योतिषी
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              अनुभवी और प्रमाणित ज्योतिषियों से व्यक्तिगत परामर्श प्राप्त करें
            </p>
          </div>

          <AstrologerSlideshow />

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              केवल ₹1100 में 30 मिनट का परामर्श
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              हमें क्यों चुनें?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">अनुभवी ज्योतिषी</h3>
              <p className="text-muted-foreground">
                10+ वर्षों के अनुभव के साथ प्रमाणित ज्योतिषी
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">गोपनीयता सुरक्षित</h3>
              <p className="text-muted-foreground">
                आपकी व्यक्तिगत जानकारी पूर्णतः सुरक्षित
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">तत्काल परामर्श</h3>
              <p className="text-muted-foreground">
                किसी भी समय ऑनलाइन परामर्श बुक करें
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}