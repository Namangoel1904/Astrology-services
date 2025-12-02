"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CitySearch, { CityItem } from "@/components/ui/CitySearch";

type PanchangResponse = {
  status: number;
  response?: any;
  message?: string;
};

type HoroscopeResponse = {
  status: number;
  response?: {
    total_score: number;
    lucky_color: string;
    lucky_color_code: string;
    lucky_number: number[];
    physique: number;
    status: number;
    finances: number;
    relationship: number;
    career: number;
    travel: number;
    family: number;
    friends: number;
    health: number;
    bot_response: string;
    zodiac: string;
  };
  remaining_api_calls?: number;
};

const ZODIAC_OPTIONS = [
  { value: 1, label: "मेष (Aries)" },
  { value: 2, label: "वृषभ (Taurus)" },
  { value: 3, label: "मिथुन (Gemini)" },
  { value: 4, label: "कर्क (Cancer)" },
  { value: 5, label: "सिंह (Leo)" },
  { value: 6, label: "कन्या (Virgo)" },
  { value: 7, label: "तुला (Libra)" },
  { value: 8, label: "वृश्चिक (Scorpio)" },
  { value: 9, label: "धनु (Sagittarius)" },
  { value: 10, label: "मकर (Capricorn)" },
  { value: 11, label: "कुंभ (Aquarius)" },
  { value: 12, label: "मीन (Pisces)" },
];

export default function PanchangHoroscopePage() {
  const today = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PanchangResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [horoscopeResult, setHoroscopeResult] = useState<HoroscopeResponse | null>(null);
  const [horoscopeError, setHoroscopeError] = useState<string | null>(null);

  const setToday = () => {
    const todayInput = document.getElementById('date') as HTMLInputElement;
    if (todayInput) {
      todayInput.value = today;
    }
  };

  const handleCitySelect = (item: CityItem) => {
    const latEl = document.getElementById('lat') as HTMLInputElement | null;
    const lonEl = document.getElementById('lon') as HTMLInputElement | null;
    if (latEl) latEl.value = String(item.lat);
    if (lonEl) lonEl.value = String(item.lon);
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const date = formData.get('date') as string;
    const lat = formData.get('lat') as string;
    const lon = formData.get('lon') as string;
    const tz = formData.get('tz') as string;

    if (!date || !lat || !lon || !tz) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon)) || isNaN(parseFloat(tz))) {
      setError("Latitude, longitude, and timezone must be valid numbers");
      setLoading(false);
      return;
    }

    try {
      const body = Object.fromEntries(formData.entries());
      const res = await fetch("/api/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setResult(json as any);
    } catch (e: any) {
      setError(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function onHoroscopeSubmit(formData: FormData) {
    setHoroscopeLoading(true);
    setHoroscopeError(null);
    setHoroscopeResult(null);

    const date = formData.get('horoscope-date') as string;
    const zodiac = formData.get('zodiac') as string;

    if (!date || !zodiac) {
      setHoroscopeError("Date and zodiac sign are required");
      setHoroscopeLoading(false);
      return;
    }

    try {
      const body = {
        date,
        zodiac: parseInt(zodiac),
        split: false,
        type: "big",
        lang: "mr"
      };
      
      const res = await fetch("/api/horoscope/daily-sun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      setHoroscopeResult(json as HoroscopeResponse);
    } catch (e: any) {
      setHoroscopeError(e.message || "Unexpected error");
    } finally {
      setHoroscopeLoading(false);
    }
  }

  const pretty = (result as any)?.response ?? result;
  const horoscope = horoscopeResult?.response;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">पंचांग आणि दैनिक भविष्य</h1>
          <p className="text-xl opacity-90">दैनिक पंचांग तपशील आणि राशिफल</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Image Section */}
        <div className="mb-8 flex justify-center">
          <img 
            src="https://drjyotijoshi.com/wp-content/uploads/2025/10/31-10-2025-2.jpeg" 
            alt="Panchang Image" 
            className="w-full max-w-4xl rounded-lg shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panchang Section */}
          <Card className="p-6 space-y-6 border-amber-300/60 dark:border-amber-700/60 bg-white/80 dark:bg-amber-950/20 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mb-2">आजचे पंचांग</h2>
              <p className="text-amber-800/80 dark:text-amber-100/70">दैनिक पंचांग तपशील</p>
            </div>
            
            <form action={onSubmit} className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">शहर शोधा</Label>
                <CitySearch placeholder="उदा. मुंबई, पुणे, दिल्ली" countrycodes="in" onSelect={handleCitySelect} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">तारीख (DD/MM/YYYY)</Label>
                <div className="flex gap-2">
                  <Input id="date" name="date" defaultValue={today} placeholder="17/10/2025" required />
                  <Button type="button" variant="outline" onClick={setToday} className="whitespace-nowrap">आज</Button>
                </div>
              </div>

              <input id="lat" name="lat" defaultValue="19.0760" hidden readOnly />
              <input id="lon" name="lon" defaultValue="72.8777" hidden readOnly />

              <div className="space-y-2">
                <Label htmlFor="tz">वेळ क्षेत्र (e.g. 5.5)</Label>
                <Input id="tz" name="tz" defaultValue="5.5" placeholder="5.5" required />
              </div>
              <input id="lang" name="lang" defaultValue="mr" hidden readOnly />

              <div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  {loading ? "पंचांग मिळवत आहे..." : "पंचांग मिळवा"}
                </Button>
              </div>
            </form>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            {pretty && (
              <div className="space-y-6">
                <Section title="आजचे पंचांग">
                  <Row label="तिथि" value={`${pretty.tithi?.name ?? "-"} (${pretty.tithi?.type ?? "-"})`} rightLabel="पक्ष" rightValue={pretty.advanced_details?.masa?.paksha ?? pretty.tithi?.type} />
                  <Row label="नक्षत्र" value={`${pretty.nakshatra?.name ?? "-"}`} rightLabel="योग" rightValue={pretty.yoga?.name ?? "-"} />
                  <Row label="करण" value={pretty.karana?.name ?? "-"} rightLabel="वार" rightValue={pretty.day?.name ?? pretty.advanced_details?.vaara} />
                </Section>

                <Divider />

                <Section title="सूर्य आणि चंद्र गणना">
                  <Row label="सूर्योदय" value={pretty.advanced_details?.sun_rise} rightLabel="चंद्रोदय" rightValue={pretty.advanced_details?.moon_rise} />
                  <Row label="सूर्यास्त" value={pretty.advanced_details?.sun_set} rightLabel="चंद्रास्त" rightValue={pretty.advanced_details?.moon_set} />
                  <Row label="राशी" value={pretty.rasi?.name} rightLabel="ऋतु" rightValue={pretty.advanced_details?.masa?.ritu} />
                </Section>

                <Divider />

                <Section title="हिंदू महिना आणि वर्ष">
                  <Row label="शक संवत" value={pretty.advanced_details?.years?.saka} rightLabel="विक्रम संवत" rightValue={pretty.advanced_details?.years?.vikram_samvaat} />
                  <Row label="काली संवत" value={pretty.advanced_details?.years?.kali} rightLabel="अयनांश" rightValue={pretty.ayanamsa?.name} />
                  <Row label="मास (पूर्णिमांत)" value={pretty.advanced_details?.masa?.purnimanta_name} rightLabel="मास (अमांत)" rightValue={pretty.advanced_details?.masa?.amanta_name} />
                </Section>

                <Divider />

                <Section title="अशुभ काळ (Inauspicious Timings)">
                  <Row label="राहुकाल" value={pretty.rahukaal} rightLabel="गुलिका" rightValue={pretty.gulika} />
                  <Row label="यमगंड" value={pretty.yamakanta} rightLabel="अभिजीत (शुभ)" rightValue={`${pretty.advanced_details?.abhijit_muhurta?.start ?? "-"} → ${pretty.advanced_details?.abhijit_muhurta?.end ?? "-"}`} />
                </Section>
              </div>
            )}
          </Card>

          {/* Horoscope Section */}
          <Card className="p-6 space-y-6 border-amber-300/60 dark:border-amber-700/60 bg-white/80 dark:bg-amber-950/20 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mb-2">दैनिक राशिफल</h2>
              <p className="text-amber-800/80 dark:text-amber-100/70">आपल्या राशीचे दैनिक भविष्य</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onHoroscopeSubmit(formData);
            }} className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horoscope-date">तारीख (DD/MM/YYYY)</Label>
                <div className="flex gap-2">
                  <Input id="horoscope-date" name="horoscope-date" defaultValue={today} placeholder="17/10/2025" required />
                  <Button type="button" variant="outline" onClick={() => {
                    const todayInput = document.getElementById('horoscope-date') as HTMLInputElement;
                    if (todayInput) todayInput.value = today;
                  }} className="whitespace-nowrap">आज</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zodiac">राशी निवडा</Label>
                <Select name="zodiac" required>
                  <SelectTrigger>
                    <SelectValue placeholder="आपली राशी निवडा" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZODIAC_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button type="submit" disabled={horoscopeLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  {horoscopeLoading ? "राशिफल मिळवत आहे..." : "राशिफल मिळवा"}
                </Button>
              </div>
            </form>

            {horoscopeError && <div className="text-red-500 text-sm text-center">{horoscopeError}</div>}

            {horoscope && (
              <div className="space-y-6">
                <Section title="आजचे भविष्य">
                  <Row label="एकूण गुण" value={`${horoscope.total_score}/100`} rightLabel="राशी" rightValue={horoscope.zodiac} />
                  <Row label="शुभ रंग" value={horoscope.lucky_color} rightLabel="शुभ अंक" rightValue={horoscope.lucky_number.join(", ")} />
                </Section>

                <Divider />

                <Section title="जीवनाचे क्षेत्र">
                  <Row label="आरोग्य" value={`${horoscope.health}/100`} rightLabel="करिअर" rightValue={`${horoscope.career}/100`} />
                  <Row label="पैसा" value={`${horoscope.finances}/100`} rightLabel="प्रेम" rightValue={`${horoscope.relationship}/100`} />
                  <Row label="कुटुंब" value={`${horoscope.family}/100`} rightLabel="मित्र" rightValue={`${horoscope.friends}/100`} />
                  <Row label="प्रवास" value={`${horoscope.travel}/100`} rightLabel="शारीरिक स्थिती" rightValue={`${horoscope.physique}/100`} />
                </Section>

                <Divider />

                <Section title="आजचे भविष्यवाणी">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm leading-relaxed text-purple-900 dark:text-purple-100">
                      {horoscope.bot_response}
                    </p>
                  </div>
                </Section>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 border-amber-300/60 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-900/20">
      <div className="text-base font-semibold mb-3 text-amber-900 dark:text-amber-200">{title}</div>
      <div className="divide-y divide-amber-200 dark:divide-amber-800">
        {children}
      </div>
    </Card>
  );
}

function Row({ label, value, rightLabel, rightValue }: { label: string; value?: string; rightLabel?: string; rightValue?: string }) {
  return (
    <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <KV label={label} value={value} />
      {rightLabel && <KV label={rightLabel} value={rightValue} />}
    </div>
  );
}

function KV({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between">
      <div className="text-sm text-amber-800/90 dark:text-amber-100/80">{label}</div>
      <div className="text-sm font-medium text-right max-w-[65%] text-amber-950 dark:text-amber-50">{value || "-"}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-1 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 opacity-60" />;
}

