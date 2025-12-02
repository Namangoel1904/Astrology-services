"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "लॉगिन असफल रहा");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "लॉगिन असफल रहा");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/40 to-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-black/70 border border-purple-500/30 p-8 space-y-6 text-white">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">डैशबोर्ड लॉगिन</h1>
          <p className="text-sm text-purple-200">
            एडमिन एवं ज्योतिषी अपने अद्वितीय यूज़रनेम से लॉगिन करें
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm">यूज़रनेम</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="उदा. priti"
              className="bg-black/40 border-purple-500/40 text-white"
            />
          </div>
          <div>
            <Label className="text-sm">पासवर्ड</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड"
              className="bg-black/40 border-purple-500/40 text-white"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
            disabled={loading}
          >
            {loading ? "कृपया प्रतीक्षा करें..." : "लॉगिन करें"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

