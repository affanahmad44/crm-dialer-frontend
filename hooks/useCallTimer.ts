"use client";

import {
  useEffect,
  useState,
} from "react";

export default function useCallTimer(
  isRunning: boolean
) {

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {

    if (!isRunning) {
      return;
    }

    const interval =
      setInterval(() => {

        setSeconds(
          (previous) => previous + 1
        );

      }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, [isRunning]);

  useEffect(() => {

    if (!isRunning) {
      setSeconds(0);
    }

  }, [isRunning]);

  return {
    seconds,
  };
}