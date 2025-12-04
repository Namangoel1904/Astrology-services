"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, IndianRupee, CheckCircle2, Loader2 } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  astrologerId: string;
  astrologerName: string;
  fee: number;
  sessionMinutes: number;
}

interface CreateOrderResponse {
  orderId: string;
  razorpayKey: string;
  amount: number;
  currency: string;
  appointment: {
    astrologerName: string;
    date: string;
    slot: string;
  };
  client: {
    clientName: string;
    email: string;
    phone: string;
    dob: string;
    tob: string;
    topic: string;
    birthplace: string;
  };
}

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookingModal({
  open,
  onOpenChange,
  astrologerId,
  astrologerName,
  fee,
  sessionMinutes,
}: BookingModalProps) {
  const [appointmentDate, setAppointmentDate] = useState<Date>(today());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    topic: "",
    birthplace: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");
  const [successBooking, setSuccessBooking] = useState<{
    clientName: string;
    email: string;
    phone: string;
    dob: string;
    tob: string;
    birthplace: string;
    topic: string;
    appointmentDate: string;
    appointmentSlot: string;
  } | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    if ((window as any).Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setError("Razorpay script लोड नहीं हुआ, कृपया पुनः प्रयास करें.");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [open]);

  const fetchSlots = useMemo(
    () => async (dateObj: Date) => {
      setLoadingSlots(true);
      setError("");
      try {
        const res = await fetch("/api/bookings/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            astrologerId,
            date: formatISODate(dateObj),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Slots लोड नहीं हुए");
        setSlots(data.slots || []);
        setSelectedSlot("");
      } catch (err: any) {
        setError(err.message || "Slots लोड नहीं हुए");
      } finally {
        setLoadingSlots(false);
      }
    },
    [astrologerId]
  );

  useEffect(() => {
    if (!open) return;
    fetchSlots(appointmentDate);
  }, [fetchSlots, appointmentDate, open]);

  const handleInput =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const resetState = () => {
    setForm({
      clientName: "",
      email: "",
      phone: "",
      dob: "",
      tob: "",
      topic: "",
      birthplace: "",
    });
    setSelectedSlot("");
    setError("");
    setAppointmentDate(today());
  };

  const handlePayment = async () => {
    if (!selectedSlot) {
      setError("कृपया समय स्लॉट चुनें");
      return;
    }
    if (
      !form.clientName ||
      !form.email ||
      !form.phone ||
      !form.dob ||
      !form.tob ||
      !form.topic ||
      !form.birthplace
    ) {
      setError("कृपया सभी विवरण भरें");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        astrologerId,
        date: formatISODate(appointmentDate),
        slot: selectedSlot,
        clientName: form.clientName,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        tob: form.tob,
        topic: form.topic,
        birthplace: form.birthplace,
      };
      const res = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as CreateOrderResponse | { error?: string };
      if (!res.ok) {
        throw new Error((json as any)?.error || "ऑर्डर नहीं बन पाया");
      }
      if (!(window as any).Razorpay || !razorpayReady) {
        throw new Error("भुगतान विंडो उपलब्ध नहीं है");
      }

      const options = {
        key: (json as CreateOrderResponse).razorpayKey,
        amount: (json as CreateOrderResponse).amount,
        currency: (json as CreateOrderResponse).currency,
        name: astrologerName,
        description: `Consultation (${
          (json as CreateOrderResponse).appointment.date
        } • ${(json as CreateOrderResponse).appointment.slot})`,
        order_id: (json as CreateOrderResponse).orderId,
        prefill: {
          name: form.clientName,
          email: form.email,
          contact: form.phone,
        },
        handler: async (response: any) => {
          try {
            const confirmRes = await fetch("/api/bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                astrologerId,
                date: (json as CreateOrderResponse).appointment.date,
                slot: (json as CreateOrderResponse).appointment.slot,
                amount: (json as CreateOrderResponse).amount,
                currency: (json as CreateOrderResponse).currency,
                client: payload,
              }),
            });
            const confirmJson = await confirmRes.json();
            if (!confirmRes.ok) {
              throw new Error(confirmJson?.error || "बुकिंग सेव नहीं हुई");
            }
            setSuccessId(confirmJson.booking.id);
            setSuccessBooking({
              clientName: confirmJson.booking.clientName,
              email: confirmJson.booking.email,
              phone: confirmJson.booking.phone,
              dob: confirmJson.booking.dob,
              tob: confirmJson.booking.tob,
              birthplace: confirmJson.booking.birthplace,
              topic: confirmJson.booking.topic,
              appointmentDate: confirmJson.booking.appointmentDate,
              appointmentSlot: confirmJson.booking.appointmentSlot,
            });
            setSubmitting(false);
            resetState();
          } catch (confirmError: any) {
            setError(confirmError.message || "बुकिंग सेव नहीं हुई");
            setSubmitting(false);
          }
        },
        theme: { color: "#9333ea" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", (resp: any) => {
        setError(resp?.error?.description || "भुगतान अस्वीकृत");
        setSubmitting(false);
      });
      paymentObject.on("modal.closed", () => {
        setSubmitting(false);
      });
      paymentObject.open();
    } catch (err: any) {
      setError(err.message || "भुगतान आरंभ नहीं हो पाया");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        {!successId ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">परामर्श बुक करें</DialogTitle>
              <DialogDescription>
                {astrologerName} के साथ {sessionMinutes} मिनट का व्यक्तिगत सत्र
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">{sessionMinutes} मिनट का परामर्श</span>
                </div>
                <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                  <IndianRupee className="w-6 h-6" />
                  <span>{fee}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">सत्र की तारीख चुनें</h3>
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={(date) => date && setAppointmentDate(date)}
                  disabled={(date) => date < today()}
                  className="rounded-md border"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3">उपलब्ध स्लॉट</h3>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> स्लॉट लोड हो रहे हैं...
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={
                          selectedSlot === slot
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : ""
                        }
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    चयनित तारीख के लिए स्लॉट उपलब्ध नहीं हैं। कृपया दूसरी तारीख चुनें।
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">पूरा नाम</Label>
                  <Input value={form.clientName} onChange={handleInput("clientName")} placeholder="अपना नाम लिखें" required/>
                </div>
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input type="email" value={form.email} onChange={handleInput("email")} placeholder="you@example.com" required/>
                </div>
                <div>
                  <Label className="text-sm">फोन नंबर</Label>
                  <Input value={form.phone} onChange={handleInput("phone")} placeholder="10 अंकों का नंबर" required/>
                </div>
                <div>
                  <Label className="text-sm">जन्म तिथि</Label>
                  <Input type="date" value={form.dob} onChange={handleInput("dob")} required/>
                </div>
                <div>
                  <Label className="text-sm">जन्म समय</Label>
                  <Input type="time" value={form.tob} onChange={handleInput("tob")} required/>
                </div>
                <div>
                  <Label className="text-sm">जन्म स्थान</Label>
                  <Input
                    value={form.birthplace}
                    onChange={handleInput("birthplace")}
                    placeholder="शहर / गाँव का नाम"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="text-sm">चर्चा का विषय</Label>
                  <Textarea
                    value={form.topic}
                    onChange={handleInput("topic")}
                    placeholder="करियर, विवाह, स्वास्थ्य आदि..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {selectedSlot && (
                <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">तारीख:</span>{" "}
                    {appointmentDate.toLocaleDateString("hi-IN")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">समय:</span> {selectedSlot}
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 text-lg"
                disabled={submitting || !selectedSlot || !razorpayReady}
                onClick={handlePayment}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    भुगतान आरंभ हो रहा है...
                  </>
                ) : (
                  "Razorpay से भुगतान करें"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="py-10 space-y-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">बुकिंग सफल!</h3>
            <p className="text-muted-foreground">
              बुकिंग आईडी: <span className="font-semibold">{successId}</span>
            </p>
            {successBooking && (
              <div className="max-w-xl mx-auto text-left bg-black/40 border border-green-500/40 rounded-xl p-4 text-sm space-y-1">
                <p>
                  <span className="text-purple-300">ग्राहक:</span>{" "}
                  {successBooking.clientName}
                </p>
                <p>
                  <span className="text-purple-300">तिथि:</span>{" "}
                  {new Date(successBooking.appointmentDate).toLocaleDateString("hi-IN")}
                </p>
                <p>
                  <span className="text-purple-300">स्लॉट:</span>{" "}
                  {successBooking.appointmentSlot}
                </p>
                <p>
                  <span className="text-purple-300">जन्म विवरण:</span>{" "}
                  {successBooking.dob} • {successBooking.tob} •{" "}
                  {successBooking.birthplace}
                </p>
                <p>
                  <span className="text-purple-300">संपर्क:</span>{" "}
                  {successBooking.phone} • {successBooking.email}
                </p>
                <p>
                  <span className="text-purple-300">विषय:</span>{" "}
                  {successBooking.topic}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              कृपया आगे की प्रक्रिया के लिए अपना ईमेल अवश्य देखें। आपको और {astrologerName} को
              पुष्टि मेल भेज दी गई है, जिसमें आगे के निर्देश दिए रहेंगे।
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-2">
              विंडो बंद करें
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

