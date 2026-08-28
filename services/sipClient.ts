"use client";

import {
  UserAgent,
  Registerer,
  Invitation,
} from "sip.js";

const SIP_WS_URL =
  "wss://cdt-effectiveness-democrats-nottingham.trycloudflare.com";

const SIP_USERNAME = "1000";
const SIP_PASSWORD = "1234";
const SIP_DOMAIN = "34.0.227.220";

let userAgent: UserAgent | null = null;
let registerer: Registerer | null = null;

export const startSip = async (
  onIncomingCall?: (session: Invitation) => void
) => {
  // Already connected
  if (userAgent) {
    return userAgent;
  }

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

  // Register extension 1000
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