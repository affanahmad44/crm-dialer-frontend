"use client";

import {
  UserAgent,
  Registerer,
  Invitation,
  Inviter,
  Session,
  SessionState,
  Web,
} from "sip.js";

const SIP_WS_URL = process.env.NEXT_PUBLIC_SIP_WSS || "";

const SIP_USERNAME = process.env.NEXT_PUBLIC_SIP_USERNAME || "";

const SIP_PASSWORD = process.env.NEXT_PUBLIC_SIP_PASSWORD || "";

const SIP_DOMAIN = process.env.NEXT_PUBLIC_SIP_DOMAIN || "";

let userAgent: UserAgent | null = null;
let registerer: Registerer | null = null;

let remoteAudioElement: HTMLAudioElement | null = null;

/**
 * Attach the browser's remote SIP audio to an HTMLAudioElement.
 */
export const setRemoteAudioElement = (element: HTMLAudioElement | null) => {
  remoteAudioElement = element;
};

const attachSessionAudio = (session: Session) => {
  console.log("Attaching SIP session audio...");

const sdh =
  session.sessionDescriptionHandler as
    | Web.SessionDescriptionHandler
    | undefined;

if (!sdh) {
  console.warn("SessionDescriptionHandler not available yet");
  return;
}

const peerConnection =
  sdh.peerConnection;

  if (!peerConnection) {
    console.warn("RTCPeerConnection not available");
    return;
  }

  console.log("WebRTC PeerConnection found");

  peerConnection.ontrack = (
  event: RTCTrackEvent
) => {
    console.log("Remote audio track received:", event.track.kind);

    if (event.track.kind !== "audio") {
      return;
    }

    if (!remoteAudioElement) {
      console.warn("Remote audio element not registered");
      return;
    }

    const remoteStream = event.streams[0];

    if (!remoteStream) {
      console.warn("No remote MediaStream found");
      return;
    }

    remoteAudioElement.srcObject = remoteStream;

    remoteAudioElement.autoplay = true;

    remoteAudioElement
      .play()
      .then(() => {
        console.log("Remote audio playback started");
      })
      .catch((error) => {
        console.error("Remote audio playback failed:", error);
      });
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("WebRTC connection state:", peerConnection.connectionState);
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };
};

const setupSession = (session: Session) => {
  session.stateChange.addListener((state) => {
    console.log("SIP session state:", state);

    if (state === SessionState.Establishing) {
      console.log("SIP session establishing...");
    }

    if (state === SessionState.Established) {
      console.log("SIP session established");

      attachSessionAudio(session);
    }

    if (state === SessionState.Terminated) {
      console.log("SIP session terminated");

      if (remoteAudioElement) {
        remoteAudioElement.srcObject = null;
      }
    }
  });
};

export const startSip = async (
  onIncomingCall?: (session: Invitation) => void,
) => {
  if (!SIP_WS_URL) {
    throw new Error("NEXT_PUBLIC_SIP_WSS is not configured");
  }

  if (!SIP_USERNAME) {
    throw new Error("NEXT_PUBLIC_SIP_USERNAME is not configured");
  }

  if (!SIP_PASSWORD) {
    throw new Error("NEXT_PUBLIC_SIP_PASSWORD is not configured");
  }

  if (!SIP_DOMAIN) {
    throw new Error("NEXT_PUBLIC_SIP_DOMAIN is not configured");
  }

  if (userAgent) {
    return userAgent;
  }

  console.log("Starting SIP client...");

  console.log("SIP WebSocket:", SIP_WS_URL);

  console.log("SIP Domain:", SIP_DOMAIN);

  console.log("SIP Username:", SIP_USERNAME);

  const uri = UserAgent.makeURI(`sip:${SIP_USERNAME}@${SIP_DOMAIN}`);

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

    sessionDescriptionHandlerFactoryOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },

    delegate: {
      onInvite: async (invitation) => {
        console.log("Incoming SIP call received:", invitation);

        setupSession(invitation);

        try {
          console.log("Answering incoming SIP call...");

          await invitation.accept();

          console.log("Incoming SIP call answered");

          if (onIncomingCall) {
            onIncomingCall(invitation);
          }
        } catch (error) {
          console.error("Failed to answer incoming SIP call:", error);
        }
      },
    },
  });

  await userAgent.start();

  console.log("SIP UserAgent started");

  registerer = new Registerer(userAgent);

  await registerer.register();

  console.log(`SIP registered successfully: ${SIP_USERNAME}@${SIP_DOMAIN}`);

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

    if (remoteAudioElement) {
      remoteAudioElement.srcObject = null;
    }

    console.log("SIP client stopped");
  } catch (error) {
    console.error("Error stopping SIP client:", error);
  }
};

export const getSipUserAgent = () => {
  return userAgent;
};

export const makeSipCall = async (destination: string): Promise<Session> => {
  if (!userAgent) {
    throw new Error("SIP client is not connected");
  }

  const target = UserAgent.makeURI(`sip:${destination}@${SIP_DOMAIN}`);

  if (!target) {
    throw new Error("Failed to create SIP destination URI");
  }

  const inviter = new Inviter(userAgent, target);

  setupSession(inviter);

  await inviter.invite();

  console.log("Outbound SIP call started:", destination);

  return inviter;
};
