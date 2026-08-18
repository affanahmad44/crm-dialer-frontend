"use client";

interface DialPadProps {
  onDigitPress: (digit: string) => void;
}

const buttons = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "*", "0", "#",
];

export default function DialPad({
  onDigitPress,
}: DialPadProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {buttons.map((digit) => (
        <button
          key={digit}
          onClick={() => onDigitPress(digit)}
          className="h-20 rounded-full bg-gray-100 text-3xl font-bold transition hover:bg-gray-200"
        >
          {digit}
        </button>
      ))}
    </div>
  );
}