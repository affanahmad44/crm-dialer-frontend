"use client";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NumberInput({
  value,
  onChange,
}: NumberInputProps) {
  return (
    <input
      type="tel"
      placeholder="+91XXXXXXXXXX"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 p-4 text-center text-2xl font-semibold outline-none focus:border-blue-500"
    />
  );
}