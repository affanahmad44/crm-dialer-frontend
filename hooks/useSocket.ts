"use client";

import { useEffect } from "react";

import { socket } from "@/services/socket";

import { useCall } from "@/context/CallContext";
import { CallState } from "@/types/call";

interface CallEvent {
  event: string;
  uuid: string;
  caller?: string;
  destination?: string;
  state?: CallState;
  hangupCause?: string;
}

export default function useSocket() {

  const {
    setCurrentCall,
    setCallState,
  } = useCall();

  useEffect(() => {

    socket.connect();

    const handleConnect = () => {

      console.log(
        "Connected to Dialer Socket:",
        socket.id
      );

    };

    const handleDisconnect = () => {

      console.log(
        "Disconnected from Dialer Socket"
      );

    };

    const handleCallEvent = (data: CallEvent) => {

      console.log(
        "FreeSWITCH Event:",
        data
      );

      const {
        event,
        uuid,
        caller,
        destination,
        state,
        hangupCause,
      } = data;

      // -------------------------
      // CALL CREATED
      // -------------------------

      if (event === "CHANNEL_CREATE") {

        setCallState("calling");

        setCurrentCall({
          uuid,
          number: destination || caller || "",
          gateway: "twilio",
          direction: "outbound",
          state: "calling",
          duration: 0,
        });

      }

      // -------------------------
      // CALL ANSWERED
      // -------------------------

      if (event === "CHANNEL_ANSWER") {

        setCallState("connected");

        setCurrentCall((previous) =>
          previous
            ? {
                ...previous,
                state: "connected",
              }
            : previous
        );

      }

      // -------------------------
      // CALL HANGUP
      // -------------------------

      if (event === "CHANNEL_HANGUP") {

        console.log(
          "Hangup Cause:",
          hangupCause
        );

        setCallState("completed");

        setCurrentCall((previous) =>
          previous
            ? {
                ...previous,
                state: "completed",
              }
            : previous
        );

      }

      // -------------------------
      // CALL HOLD
      // -------------------------

      if (event === "CHANNEL_HOLD") {

        setCallState("connected");

      }

      // -------------------------
      // CALL UNHOLD
      // -------------------------

      if (event === "CHANNEL_UNHOLD") {

        setCallState("connected");

      }

    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "call:event",
      handleCallEvent
    );

    return () => {

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "call:event",
        handleCallEvent
      );

      socket.disconnect();

    };

  }, [
    setCurrentCall,
    setCallState,
  ]);

}