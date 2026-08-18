export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold">CRM Dialer</h1>

      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-green-500"></span>

        <span className="font-medium">
          Agent Online
        </span>
      </div>
    </header>
  );
}