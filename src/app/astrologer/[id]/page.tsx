"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { findAstrologer } from "@/lib/astrologers-data";
import { getSlotsForDate } from "@/lib/availability";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Award,
  Languages,
  Clock,
  IndianRupee,
  ArrowLeft,
  ShieldCheck,
  BookCheck,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingModal from "@/components/ui/BookingModal";

export default function AstrologerDetailPage() {
  const params = useParams();
  const astrologer = useMemo(() => {
    if (!params?.id || Array.isArray(params.id)) return undefined;
    return findAstrologer(params.id);
  }, [params]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!astrologer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">ज्योतिषी नहीं मिले</h1>
          <Link href="/">
            <Button>होम पर वापस जाएं</Button>
          </Link>
        </div>
      </div>
    );
  }

  const todaySlots = getSlotsForDate(astrologer, new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0015] to-black text-white">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-10">
          <Link href="/">
            <Button variant="ghost" className="mb-2 gap-2 text-purple-200">
              <ArrowLeft className="w-4 h-4" />
              वापस जाएं
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden border border-purple-500/40 bg-black/40 backdrop-blur-md">
              <div className="relative h-[520px]">
                <Image
                  src={astrologer.avatar}
                  alt={astrologer.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-1">{astrologer.name}</h1>
                    <p className="text-xl text-purple-200">{astrologer.headline}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-900/30 px-5 py-2 rounded-full border border-yellow-500/40">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{astrologer.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-purple-900/40 border border-purple-500/40 text-sm py-1.5 px-4">
                    {astrologer.experienceRange}
                  </Badge>
                  <Badge className="bg-purple-900/40 border border-purple-500/40 text-sm py-1.5 px-4">
                    {astrologer.totalConsultations}+ परामर्श
                  </Badge>
                </div>

                <p className="text-base text-purple-100 leading-relaxed">
                  {astrologer.longBio}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="p-5 bg-black/50 border border-purple-500/40">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-300" />
                    विशेषज्ञता
                  </h2>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-base py-2 px-4 border-none">
                    {astrologer.topicExpertise}
                  </Badge>
                </Card>

                <Card className="p-5 bg-black/50 border border-purple-500/40">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-purple-300" />
                    भाषाएं
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {astrologer.languages.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="border-purple-500/60 text-sm px-3 py-1.5"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-r from-purple-900/70 to-pink-900/40 border border-purple-500/60">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm text-purple-100 mb-1">परामर्श शुल्क</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-6 h-6 text-purple-200" />
                      <span className="text-3xl font-bold text-white">{astrologer.fee}</span>
                      <span className="text-purple-200 text-sm">
                        / {astrologer.sessionMinutes} मिनट सेशन
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-purple-900 hover:bg-purple-100 font-semibold"
                    onClick={() => setIsBookingOpen(true)}
                  >
                    अभी बुक करें
                  </Button>
                </div>
                <p className="text-xs text-purple-100 mt-3">
                  Razorpay द्वारा सुरक्षित भुगतान • बुकिंग पुष्टी ईमेल व सूचनांसह
                </p>
              </Card>

              <Card className="p-6 bg-black/50 border border-purple-500/40">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookCheck className="w-5 h-5 text-purple-300" />
                  आचार्यांच्या योग्यता
                </h2>
                <ul className="space-y-2 text-purple-100">
                  {astrologer.credentials.map((cred) => (
                    <li key={cred} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                      {cred}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Card className="p-6 bg-black/50 border border-purple-500/40">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
              <Clock className="w-6 h-6 text-purple-300" />
              आसानी से ज्योतिष आचार्यो से जुड़े 
            </h2>
            {/* {todaySlots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {todaySlots.map((slot) => (
                  <div
                    key={slot}
                    className="text-center border border-purple-500/40 rounded-lg py-3 text-sm text-purple-100 bg-purple-900/20"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-200">
                आज निवडलेल्या तारखेसाठी स्लॉट उपलब्ध नाहीत. कृपया बुकिंग करताना दुसरी तारीख निवडा.
              </p>
            )} */}
            <div className="mt-6 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10"
                onClick={() => setIsBookingOpen(true)}
              >
                परामर्श बुक करें
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />

      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        astrologerId={astrologer.id}
        astrologerName={astrologer.name}
        fee={astrologer.fee}
        sessionMinutes={astrologer.sessionMinutes}
      />
    </div>
  );
}

