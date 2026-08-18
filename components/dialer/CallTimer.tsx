interface Props {
  seconds: number;
}

export default function CallTimer({
  seconds,
}: Props) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remaining = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="rounded-xl border bg-white p-5 shadow">
      <h3 className="mb-2 text-lg font-semibold">
        Call Timer
      </h3>

      <p className="text-3xl font-bold">
        {minutes}:{remaining}
      </p>
    </div>
  );
}