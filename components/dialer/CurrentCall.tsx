import { Call } from "@/types/call";

interface Props {
  call: Call | null;
}

export default function CurrentCall({
  call,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold">
        Current Call
      </h2>

      {!call ? (
        <p className="text-gray-500">
          No Active Call
        </p>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>UUID:</strong> {call.uuid}
          </p>

          <p>
            <strong>Number:</strong> {call.number}
          </p>

          <p>
            <strong>Gateway:</strong> {call.gateway}
          </p>

          <p>
            <strong>Direction:</strong> {call.direction}
          </p>

          <p>
            <strong>Status:</strong> {call.state}
          </p>
        </div>
      )}
    </div>
  );
}