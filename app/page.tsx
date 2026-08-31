"use client";

import { useEffect, useState, useRef } from "react";

import { toast } from "react-hot-toast";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import NumberInput from "@/components/dialer/NumberInput";
import DialPad from "@/components/dialer/DialPad";
import CallControls from "@/components/dialer/CallControls";
import CallStatus from "@/components/dialer/CallStatus";
import CurrentCall from "@/components/dialer/CurrentCall";
import CallTimer from "@/components/dialer/CallTimer";

import useCallTimer from "@/hooks/useCallTimer";
import useSocket from "@/hooks/useSocket";

import {
  makeCall,
  hangupCall,
} from "@/services/callApi";

import {
  startSip,
  stopSip,
  setRemoteAudioElement,
} from "@/services/sipClient";

import { useCall } from "@/context/CallContext";

export default function Home() {

  const remoteAudioRef =
  useRef<HTMLAudioElement | null>(null);

  // -------------------------
  // SOCKET.IO
  // -------------------------

  useSocket();

  // -------------------------
  // STATE
  // -------------------------

  const [number, setNumber] =
    useState("");

  const [sipReady, setSipReady] =
    useState(false);

  const {
    currentCall,
    callState,
    setCallState,
  } = useCall();

  // -------------------------
  // START BROWSER SIP PHONE
  // -------------------------

  useEffect(() => {

    let mounted = true;

    const initializeSip = async () => {

      try {

        console.log(
          "Starting browser SIP client..."
        );

        await startSip(
          (incomingCall) => {

            console.log(
              "Incoming SIP call:",
              incomingCall
            );

            toast.success(
              "Incoming call"
            );
          }
        );

        if (mounted) {

          setSipReady(true);

          console.log(
            "Browser SIP client ready"
          );
        }

      } catch (error) {

        console.error(
          "SIP initialization failed:",
          error
        );

        if (mounted) {

          setSipReady(false);

          toast.error(
            "Unable to connect phone"
          );
        }
      }
    };

    initializeSip();

    return () => {

      mounted = false;

      stopSip().catch(
        console.error
      );
    };

  }, []);

  // -------------------------
  // CALL TIMER
  // -------------------------

  const isConnected =
    callState === "connected";

  const {
    seconds,
  } = useCallTimer(
    isConnected
  );

  // -------------------------
  // MAKE CALL
  // -------------------------

  const handleCall = async () => {

    if (!number.trim()) {

      toast.error(
        "Please enter a phone number"
      );

      return;
    }

    if (!sipReady) {

      toast.error(
        "Phone is not connected"
      );

      return;
    }

    try {

      setCallState(
        "calling"
      );

      console.log(
        "Starting call:",
        number
      );

      const response =
        await makeCall({
          destination: number,
        });

      console.log(
        "Make call response:",
        response
      );

      toast.success(
        "Call initiated"
      );

    } catch (error) {

      console.error(
        "Call failed:",
        error
      );

      setCallState(
        "failed"
      );

      toast.error(
        "Failed to initiate call"
      );

    }

  };

  // -------------------------
  // HANGUP
  // -------------------------

  const handleHangup =
    async () => {

      if (!currentCall?.uuid) {

        toast.error(
          "No active call"
        );

        return;
      }

      try {

        await hangupCall(
          currentCall.uuid
        );

        setCallState(
          "completed"
        );

        toast.success(
          "Call ended"
        );

      } catch (error) {

        console.error(
          "Hangup failed:",
          error
        );

        toast.error(
          "Failed to hang up call"
        );

      }

    };

  // -------------------------
  // DIAL PAD
  // -------------------------

  const handleDigitPress =
    (digit: string) => {

      setNumber(
        (previous) =>
          previous + digit
      );

    };

  // -------------------------
  // UI
  // -------------------------

  useEffect(() => {
    setRemoteAudioElement(remoteAudioRef.current);

    return () => {
      setRemoteAudioElement(null);
    };
  }, []);

  return (
    <main className="flex h-screen">
      <audio ref={remoteAudioRef} autoPlay playsInline />

      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="grid flex-1 grid-cols-3 gap-8 p-8">
          {/* ===================== */}
          {/* DIAL PAD */}
          {/* ===================== */}

          <div className="space-y-6">
            <NumberInput value={number} onChange={setNumber} />

            <DialPad onDigitPress={handleDigitPress} />

            <CallControls
              onCall={handleCall}
              onHangup={handleHangup}
              disabled={
                !sipReady ||
                (callState !== "idle" &&
                  callState !== "completed" &&
                  callState !== "failed")
              }
              hangupDisabled={!currentCall}
            />

            <div className="text-center text-sm">
              {sipReady ? (
                <span className="text-green-600">● Phone connected</span>
              ) : (
                <span className="text-red-600">● Phone disconnected</span>
              )}
            </div>
          </div>

          {/* ===================== */}
          {/* CALL STATUS */}
          {/* ===================== */}

          <div className="space-y-6">
            <CallStatus status={callState} />

            <CallTimer seconds={seconds} />
          </div>

          {/* ===================== */}
          {/* CURRENT CALL */}
          {/* ===================== */}

          <CurrentCall call={currentCall} />
        </div>
      </div>
    </main>
  );
}