"use client";

import { useState } from "react";

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

import { useCall } from "@/context/CallContext";

export default function Home() {

  // Connect to Socket.IO
  useSocket();

  const [number, setNumber] =
    useState("");

  const {
    currentCall,
    callState,
    setCallState,
  } = useCall();

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

    try {

      setCallState("calling");

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

  return (

    <main className="flex h-screen">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <div className="grid flex-1 grid-cols-3 gap-8 p-8">

          {/* ===================== */}
          {/* DIAL PAD */}
          {/* ===================== */}

          <div className="space-y-6">

            <NumberInput
              value={number}
              onChange={setNumber}
            />

            <DialPad
              onDigitPress={
                handleDigitPress
              }
            />

            <CallControls
              onCall={
                handleCall
              }
              onHangup={
                handleHangup
              }
              disabled={
                callState !== "idle" &&
                callState !== "completed" &&
                callState !== "failed"
              }
              hangupDisabled={
                !currentCall
              }
            />

          </div>

          {/* ===================== */}
          {/* CALL STATUS */}
          {/* ===================== */}

          <div className="space-y-6">

            <CallStatus
              status={
                callState
              }
            />

            <CallTimer
              seconds={
                seconds
              }
            />

          </div>

          {/* ===================== */}
          {/* CURRENT CALL */}
          {/* ===================== */}

          <CurrentCall
            call={
              currentCall
            }
          />

        </div>

      </div>

    </main>

  );
}