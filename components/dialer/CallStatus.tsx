interface Props {
  status: string;
}

export default function CallStatus({
  status,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow">
      <h3 className="mb-2 text-lg font-semibold">
        Call Status
      </h3>

      <p className="text-xl font-bold text-blue-600">
        {status}
      </p>
    </div>
  );
}