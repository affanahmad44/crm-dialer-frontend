export type CallState =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "completed"
  | "failed";

export interface Call {
  uuid: string;
  number: string;
  gateway?: string;
  direction: "inbound" | "outbound";
  state: CallState;
  duration: number;
}