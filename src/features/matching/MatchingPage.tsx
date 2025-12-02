"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AshtakootResponse = {
  status: boolean;
  message?: string;
  data?: any;
};

export default function MatchingPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">Matching</h1>
      <p className="text-muted-foreground mb-6">Ashtakoot, Dashakoot, Nakshatra match</p>

      <Tabs defaultValue="ashtakoot">
        <TabsList>
          <TabsTrigger value="ashtakoot">Ashtakoot</TabsTrigger>
          <TabsTrigger value="dashakoot">Dashakoot</TabsTrigger>
          <TabsTrigger value="nakshatra">Nakshatra Match</TabsTrigger>
        </TabsList>

        <TabsContent value="ashtakoot" className="mt-6">
          <AshtakootForm />
        </TabsContent>
        <TabsContent value="dashakoot" className="mt-6">
          <Stub label="Dashakoot (coming soon)" />
        </TabsContent>
        <TabsContent value="nakshatra" className="mt-6">
          <Stub label="Nakshatra Match (coming soon)" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stub({ label }: { label: string }) {
  return (
    <Card className="p-6">
      <p className="text-muted-foreground">{label}</p>
    </Card>
  );
}

function AshtakootForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AshtakootResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = Object.fromEntries(formData.entries());
      const res = await fetch("/api/matching/ashtakoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as AshtakootResponse;
      if (!res.ok || json.status === false) {
        throw new Error(json.message || "Failed to fetch Ashtakoot");
      }
      setResult(json);
    } catch (e: any) {
      setError(e.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <form action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="boy_dob">Boy DOB (YYYY-MM-DD)</Label>
          <Input id="boy_dob" name="boy_dob" placeholder="1995-01-01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boy_tob">Boy TOB (HH:MM)</Label>
          <Input id="boy_tob" name="boy_tob" placeholder="14:30" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boy_tz">Boy TZ (e.g. +5.5)</Label>
          <Input id="boy_tz" name="boy_tz" placeholder="5.5" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boy_lat">Boy Lat</Label>
          <Input id="boy_lat" name="boy_lat" placeholder="28.6139" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boy_lon">Boy Lon</Label>
          <Input id="boy_lon" name="boy_lon" placeholder="77.2090" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="girl_dob">Girl DOB (YYYY-MM-DD)</Label>
          <Input id="girl_dob" name="girl_dob" placeholder="1997-05-10" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="girl_tob">Girl TOB (HH:MM)</Label>
          <Input id="girl_tob" name="girl_tob" placeholder="09:15" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="girl_tz">Girl TZ (e.g. +5.5)</Label>
          <Input id="girl_tz" name="girl_tz" placeholder="5.5" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="girl_lat">Girl Lat</Label>
          <Input id="girl_lat" name="girl_lat" placeholder="19.0760" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="girl_lon">Girl Lon</Label>
          <Input id="girl_lon" name="girl_lon" placeholder="72.8777" required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lang">Language (optional)</Label>
          <Input id="lang" name="lang" placeholder="en" />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Matching..." : "Get Ashtakoot Match"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {result && (
        <pre className="mt-4 whitespace-pre-wrap break-words text-xs md:text-sm">
{JSON.stringify(result.data ?? result, null, 2)}
        </pre>
      )}
    </Card>
  );
}


