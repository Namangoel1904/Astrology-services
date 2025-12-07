"use client";

import { useEffect, useState } from "react";
import { Star, Users, Clock, Shield, X } from "lucide-react";
import AstrologerSlideshow from "@/components/AstrologerSlideshow";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/neural-network-hero";

export default function LandingPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLeadModal(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !intent.trim()) {
      setSubmitError("कृपया ईमेल और अपना उत्तर भरें");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), intent: intent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "सबमिट करने में समस्या आई");
      }
      setSubmitSuccess(true);
      setEmail("");
      setIntent("");
      setShowLeadModal(false);
    } catch (err: any) {
      setSubmitError(err?.message || "सबमिट नहीं हो सका, कृपया पुनः प्रयास करें");
    } finally {
      setSubmitting(false);
    }
  }

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
        description="Dr. Jyoti Joshi के मार्गदर्शन में प्रशिक्षित ज्योतिषाचार्य अब ऑनलाइन उपलब्ध। Razorpay भुगतान, मेल पुष्टिकरण और सुरक्षित बुकिंग."
        badgeText="सत्यापित वैदिक विशेषज्ञ"
        badgeLabel="Trusted"
        ctaButtons={[
          { text: "ज्योतिषी देखें", href: "#experts", primary: true },
          { text: "बुकिंग प्रक्रिया", href: "#process" },
        ]}
        microDetails={[
          "Razorpay secured",
          "Email confirmations",
        ]}
      />

      <div className="flex flex-col">
        <section id="experts" className="py-16 px-4 order-1 md:order-2">
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

        <section id="process" className="py-16 px-4 bg-gradient-to-b from-purple-950/20 to-transparent order-2 md:order-1">
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
      </div>

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

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#14001f] via-black to-[#0b0015] p-6 shadow-2xl">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute right-3 top-3 text-purple-200 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-semibold mb-2 text-white">
              संपर्क में रहें
            </h3>
            <p className="text-sm text-purple-200 mb-4">
              अपना ईमेल और संक्षिप्त उत्तर साझा करें। हम आपको परामर्श या सेवा के अवसरों के बारे में संपर्क करेंगे।
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-purple-200 mb-1">
                  ईमेल
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-purple-500/40 bg-black/60 px-3 py-2 text-white focus:border-purple-300 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-purple-200 mb-1">
                  आप हमारे प्लेटफार्म से जुड़कर ज्योतिष आचार्य से परामर्श लेना चाहते हैं या आप स्वयं परामर्ष सेवा देना चाहते है?
                </label>
                <textarea
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full rounded-lg border border-purple-500/40 bg-black/60 px-3 py-2 text-white focus:border-purple-300 focus:outline-none"
                  rows={3}
                  placeholder="संक्षेप में बताएं..."
                  required
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  धन्यवाद! आपकी जानकारी प्राप्त हो गई है।
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="rounded-lg border border-purple-500/40 px-4 py-2 text-sm text-purple-100 hover:bg-white/5"
                >
                  बाद में
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:from-purple-400 hover:to-pink-400 disabled:opacity-60"
                >
                  {submitting ? "भेजा जा रहा है..." : "सबमिट करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

