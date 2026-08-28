"use client";

import {
  UserAgent,
  Registerer,
  Invitation,
} from "sip.js";

const SIP_WS_URL =
  process.env.NEXT_PUBLIC_SIP_WSS || "";

const SIP_USERNAME =
  process.env.NEXT_PUBLIC_SIP_USERNAME || "";

const SIP_PASSWORD =
  process.env.NEXT_PUBLIC_SIP_PASSWORD || "";

const SIP_DOMAIN =
  process.env.NEXT_PUBLIC_SIP_DOMAIN || "";

let userAgent: UserAgent | null = null;
let registerer: Registerer | null = null;

export const startSip = async (
  onIncomingCall?: (session: Invitation) => void
) => {
  // Validate environment variables
  if (!SIP_WS_URL) {
    throw new Error(
      "NEXT_PUBLIC_SIP_WSS is not configured"
    );
  }

  if (!SIP_USERNAME) {
    throw new Error(
      "NEXT_PUBLIC_SIP_USERNAME is not configured"
    );
  }

  if (!SIP_PASSWORD) {
    throw new Error(
      "NEXT_PUBLIC_SIP_PASSWORD is not configured"
    );
  }

  if (!SIP_DOMAIN) {
    throw new Error(
      "NEXT_PUBLIC_SIP_DOMAIN is not configured"
    );
  }

  // Already connected
  if (userAgent) {
    return userAgent;
  }

  console.log("Starting SIP client...");
  console.log("SIP WebSocket:", SIP_WS_URL);
  console.log("SIP Domain:", SIP_DOMAIN);
  console.log("SIP Username:", SIP_USERNAME);

  const uri = UserAgent.makeURI(
    `sip:${SIP_USERNAME}@${SIP_DOMAIN}`
  );

  if (!uri) {
    throw new Error("Failed to create SIP URI");
  }

  userAgent = new UserAgent({
    uri,

    authorizationUsername: SIP_USERNAME,

    authorizationPassword: SIP_PASSWORD,

    transportOptions: {
      server: SIP_WS_URL,
    },

    delegate: {
      onInvite: (invitation) => {
        console.log(
          "Incoming SIP call received:",
          invitation
        );

        if (onIncomingCall) {
          onIncomingCall(invitation);
        }
      },
    },
  });

  // Start SIP UserAgent
  await userAgent.start();

  console.log("SIP UserAgent started");

  // Register extension
  registerer = new Registerer(userAgent);

  await registerer.register();

  console.log(
    `SIP registered successfully: ${SIP_USERNAME}@${SIP_DOMAIN}`
  );

  return userAgent;
};

export const stopSip = async () => {
  try {
    if (registerer) {
      await registerer.unregister();
      registerer = null;
    }

    if (userAgent) {
      await userAgent.stop();
      userAgent = null;
    }

    console.log("SIP client stopped");
  } catch (error) {
    console.error(
      "Error stopping SIP client:",
      error
    );
  }
};

export const getSipUserAgent = () => {
  return userAgent;
};