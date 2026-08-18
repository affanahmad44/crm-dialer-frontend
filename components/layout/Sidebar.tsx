export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-100 p-5">
      <nav className="space-y-3">
        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-200">
          Dialer
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-200">
          History
        </div>

        <div className="cursor-pointer rounded-lg p-3 hover:bg-gray-200">
          Settings
        </div>
      </nav>
    </aside>
  );
}