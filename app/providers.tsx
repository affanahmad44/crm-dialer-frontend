"use client";

import { Toaster } from "react-hot-toast";

import { CallProvider } from "@/context/CallContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CallProvider>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </CallProvider>
  );
}