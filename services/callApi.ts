import api from "./api";

export interface MakeCallRequest {
  destination: string;
}

export interface CallActionRequest {
  uuid: string;
}

export interface TransferCallRequest {
  uuid: string;
  destination: string;
}

export const makeCall = async (
  data: MakeCallRequest
) => {
  const response = await api.post("/calls", data);

  return response.data;
};

export const hangupCall = async (
  uuid: string
) => {
  const response = await api.post("/calls/hangup", {
    uuid,
  });

  return response.data;
};

export const holdCall = async (
  uuid: string
) => {
  const response = await api.post("/calls/hold", {
    uuid,
  });

  return response.data;
};

export const unholdCall = async (
  uuid: string
) => {
  const response = await api.post("/calls/unhold", {
    uuid,
  });

  return response.data;
};

export const transferCall = async (
  uuid: string,
  destination: string
) => {
  const response = await api.post("/calls/transfer", {
    uuid,
    destination,
  });

  return response.data;
};

export const getActiveCalls = async () => {
  const response = await api.get("/calls/active");

  return response.data;
};