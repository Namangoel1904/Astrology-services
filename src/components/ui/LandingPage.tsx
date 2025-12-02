"use client";

import { Star, Users, Clock, Shield } from "lucide-react";
import AstrologerSlideshow from "@/components/AstrologerSlideshow";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/neural-network-hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0015] to-black text-white">
      <Navigation />

      <Hero
        title={
          <>
            विश्वसनीय{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
              ज्योतिष परामर्श
            </span>
          </>
        }
        description="Dr. Jyoti Joshi के मार्गदर्शन में प्रशिक्षित 6+ अनुभवी महिला ज्योतिषी अब ऑनलाइन उपलब्ध। Razorpay भुगतान, मेल पुष्टिकरण और सुरक्षित बुकिंग."
        badgeText="सत्यापित वैदिक विशेषज्ञ"
        badgeLabel="Trusted"
        ctaButtons={[
          { text: "ज्योतिषी देखें", href: "#experts", primary: true },
          { text: "बुकिंग प्रक्रिया", href: "#process" },
        ]}
        microDetails={[
          "Site-wide dark theme",
          "Razorpay secured",
          "Email confirmations",
        ]}
      />

      <section id="process" className="py-16 px-4 bg-gradient-to-b from-purple-950/20 to-transparent">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold mb-3">बुकिंग प्रक्रिया</h2>
          <p className="text-purple-200 mb-10">केवल 4 सरल चरणों में अपनी स्लॉट बुक करें</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "ज्योतिषी चुनें", text: "6 सत्यापित प्रोफाइल" },
              { icon: Clock, title: "तारीख व स्लॉट", text: "रियल टाइम उपलब्धता" },
              { icon: Shield, title: "Razorpay भुगतान", text: "100% सुरक्षित" },
              { icon: Users, title: "ईमेल पुष्टिकरण", text: "दोनों पक्षों को तुरंत" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-purple-500/40 rounded-2xl p-5 bg-black/40 backdrop-blur">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-purple-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experts" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              प्रमाणित <span className="text-purple-300">ज्योतिषी</span>
            </h2>
            <p className="text-purple-200 max-w-3xl mx-auto">
              हर प्रोफाइल के साथ वास्तविक बायोडेटा, उपलब्ध स्लॉट और डायरेक्ट बुकिंग
            </p>
          </div>
          <AstrologerSlideshow />
          <div className="text-center mt-10 text-sm text-purple-200">
            सभी सेशन ₹1100 के बीच, 25-35 मिनट के लिए
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-t from-purple-950/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">हम क्यों अलग हैं?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-black/60 border border-purple-500/30">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">सत्यापित अनुभव</h3>
              <p className="text-purple-200">
                Jyotish Praveen, Jyotish Visharad एवं Ashtakvarg प्रमाणपत्र धारक विशेषज्ञ
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/60 border border-purple-500/30">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">गोपनीयता व सुरक्षा</h3>
              <p className="text-purple-200">
                Razorpay भुगतान, SSL और दोहरी ईमेल सूचनाएं—ग्राहक व ज्योतिषी दोनों के लिए
              </p>
            </div>

            <div className="text-center प-6 rounded-xl bg-black/60 border border-purple-500/30">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">लाइव उपलब्ध स्लॉट</h3>
              <p className="text-purple-200">
                हर ज्योतिषी का सप्ताहवार स्लॉट मैप—बुकिंग के बाद स्वतः ब्लॉक
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

