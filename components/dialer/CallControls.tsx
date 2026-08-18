"use client";

import { Phone, PhoneOff } from "lucide-react";

interface Props {
  onCall: () => void;
  onHangup: () => void;
  disabled?: boolean;
  hangupDisabled?: boolean;
}

export default function CallControls({
  onCall,
  onHangup,
  disabled = false,
  hangupDisabled = false,
}: Props) {
  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={onCall}
        disabled={disabled}
        className="flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Phone size={20} />
        Call
      </button>

      <button
        onClick={onHangup}
        disabled={hangupDisabled}
        className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PhoneOff size={20} />
        Hangup
      </button>
    </div>
  );
}