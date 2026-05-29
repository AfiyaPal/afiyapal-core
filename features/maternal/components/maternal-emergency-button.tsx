"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Baby, HeartPulse, Loader2, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type EmergencyType = "maternal" | "medical";
type Step = "idle" | "countdown" | "form" | "sending" | "success" | "error";

const EMERGENCY_OPTIONS: { value: EmergencyType; label: string; icon: typeof Baby }[] = [
  { value: "maternal", label: "Maternal Emergency", icon: Baby },
  { value: "medical", label: "Medical Emergency", icon: HeartPulse },
];

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("afiyapal-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("afiyapal-session-id", id);
  }
  return id;
}

export function MaternalEmergencyButton() {
  const [step, setStep] = useState<Step>("idle");
  const [countdown, setCountdown] = useState(3);
  const [phone, setPhone] = useState("");
  const [emergencyType, setEmergencyType] = useState<EmergencyType>("maternal");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (step !== "countdown") return;
    if (countdown <= 0) { setStep("form"); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handlePress = useCallback(() => {
    setCountdown(3);
    setStep("countdown");
    setPhone("");
    setEmergencyType("maternal");
    setFeedback("");
    setGeoStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("success");
      },
      () => {
        setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const handleCancel = useCallback(() => {
    setStep("idle");
    setCountdown(3);
  }, []);

  async function handleSubmit() {
    setStep("sending");
    try {
      const res = await fetch("/api/maternal/emergency/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          coordinates,
          phone: phone.trim() || null,
          emergencyType,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setFeedback(data.message ?? "Response team notified.");
      setStep("success");

      localStorage.setItem("afiyapal-emergency", JSON.stringify({
        active: true,
        type: emergencyType,
        coordinates,
        phone: phone.trim() || null,
        timestamp: Date.now(),
      }));

      window.dispatchEvent(
        new CustomEvent("afiyapal:emergency", {
          detail: { active: true, type: emergencyType, coordinates, phone: phone.trim() || null, timestamp: Date.now() },
        }),
      );
    } catch {
      setFeedback("Failed to send alert. Please call emergency services directly.");
      setStep("error");
    }
  }

  function handleDismiss() {
    setStep("idle");
    setCountdown(3);
    setPhone("");
    setFeedback("");
  }

  return (
    <>
      {step === "idle" && (
        <button
          onClick={handlePress}
          className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-amber-600 px-6 py-5 text-lg font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-700 active:scale-[0.98] mb-4"
        >
          <AlertTriangle className="h-6 w-6" />
          <span>Emergency Help</span>
        </button>
      )}

      {step === "countdown" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl font-black text-amber-600">
              {countdown}
            </div>
            <p className="text-lg font-bold text-slate-800">Preparing Emergency Alert</p>
            <p className="mt-1 text-sm text-slate-500">Cancel to prevent false alarm</p>
            <button
              onClick={handleCancel}
              className="mt-6 w-full rounded-full bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Emergency Help Request</h2>
                <p className="text-xs text-slate-500">Your location will be shared with responders</p>
              </div>
            </div>

            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone number <span className="text-slate-400">(optional but recommended)</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              type="tel"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            />

            <p className="mb-2 mt-4 text-sm font-medium text-slate-700">Type of emergency:</p>
            <div className="grid grid-cols-2 gap-3">
              {EMERGENCY_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setEmergencyType(value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition",
                    emergencyType === value
                      ? value === "maternal"
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  <Icon className={cn("h-4 w-4", emergencyType === value ? (value === "maternal" ? "text-rose-600" : "text-amber-600") : "text-slate-400")} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {geoStatus === "loading"
                ? "Getting your location..."
                : geoStatus === "error"
                  ? "Could not get precise location. Proceeding without coordinates."
                  : "Location captured"}
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={handleCancel} className="flex-1 rounded-full bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 rounded-full bg-amber-600 py-3 text-sm font-semibold text-white transition hover:bg-amber-700">
                Send Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "sending" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            <p className="font-semibold text-slate-700">Sending emergency alert...</p>
          </div>
        </div>
      )}

      {(step === "success" || step === "error") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className={cn(
              "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
              step === "success" ? "bg-emerald-100" : "bg-amber-100",
            )}>
              {step === "success"
                ? <Phone className="h-7 w-7 text-emerald-600" />
                : <AlertTriangle className="h-7 w-7 text-amber-600" />}
            </div>
            <h3 className={cn("text-lg font-bold", step === "success" ? "text-emerald-800" : "text-amber-800")}>
              {step === "success" ? "Emergency Alert Sent" : "Alert Failed"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{feedback}</p>
            {step === "error" && (
              <p className="mt-1 text-xs text-slate-400">In a real emergency, call local emergency services immediately.</p>
            )}
            <button onClick={handleDismiss} className="mt-6 w-full rounded-full bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
