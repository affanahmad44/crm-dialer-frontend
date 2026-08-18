"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import { Call, CallState } from "@/types/call";

interface CallContextType {
  currentCall: Call | null;
  callState: CallState;

  setCurrentCall: React.Dispatch<
    React.SetStateAction<Call | null>
  >;

  setCallState: React.Dispatch<
    React.SetStateAction<CallState>
  >;
}

const CallContext =
  createContext<CallContextType | null>(null);

export function CallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentCall, setCurrentCall] =
    useState<Call | null>(null);

  const [callState, setCallState] =
    useState<CallState>("idle");

  return (
    <CallContext.Provider
      value={{
        currentCall,
        callState,
        setCurrentCall,
        setCallState,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);

  if (!context) {
    throw new Error(
      "useCall must be used inside CallProvider"
    );
  }

  return context;
}