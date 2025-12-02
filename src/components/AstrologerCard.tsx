"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { AstrologerProfile } from "@/lib/astrologers-data";

interface AstrologerCardProps {
  astrologer: AstrologerProfile;
}

export default function AstrologerCard({ astrologer }: AstrologerCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 astro-card w-[320px] flex-shrink-0">
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={astrologer.avatar}
          alt={astrologer.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{astrologer.rating}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{astrologer.name}</h3>
          <p className="text-sm text-purple-200 mb-3">{astrologer.experienceRange}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              key="expertise"
              variant="secondary"
              className="bg-purple-500/80 text-white border-none"
            >
              {astrologer.topicExpertise}
            </Badge>
            {astrologer.languages.slice(0, 1).map((lang, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-purple-500/80 text-white border-none"
              >
                {lang}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <div>
              <p className="text-purple-200">{astrologer.totalConsultations}+ परामर्श</p>
              <p className="text-white font-semibold">₹{astrologer.fee} / {astrologer.sessionMinutes} मिनट</p>
            </div>
            <Link href={`/astrologer/${astrologer.slug}`}>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
              >
                विवरण देखें
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}