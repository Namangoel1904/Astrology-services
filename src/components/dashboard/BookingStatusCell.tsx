"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface Props {
  bookingId: string;
  initialStatus: string;
  editable: boolean;
}

export default function BookingStatusCell({ bookingId, initialStatus, editable }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [nextStatus, setNextStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (nextStatus === status) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "अद्यतन नहीं हो पाया");
      setStatus(data.booking.status);
      setMessage("सेव हो गया");
    } catch (error: any) {
      setMessage(error.message || "त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  if (!editable) {
    return (
      <span className="px-3 py-1 rounded-full text-xs bg-purple-900/40 border border-purple-500/40 inline-block">
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <Select value={nextStatus} onValueChange={setNextStatus}>
        <SelectTrigger className="bg-black/40 border-purple-500/40 text-white h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black text-white border-purple-500/30">
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={handleUpdate} disabled={loading || nextStatus === status}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "सेव करें"}
      </Button>
      {message && <p className="text-xs text-purple-200">{message}</p>}
    </div>
  );
}

