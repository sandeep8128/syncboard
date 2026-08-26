import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutGrid, Plus, LogOut, ChevronDown, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // TODO: replace with real data once workspace API is ready (Phase 1/2)
  const workspaces: { id: string; name: string; boardCount: number }[] = [];

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#EDEAE2]">
      {/* Top nav */}
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#111111] flex items-center justify-center font-bold text-white text-xs">
            S
          </div>
          <span
            className="font-medium text-[#1A1A1A] tracking-tight"
          >
            SyncBoard
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-black/5 transition"
          >
            <div className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs font-medium flex items-center justify-center">
              {initials}
            </div>
            <span className="text-sm text-[#1A1A1A] font-medium hidden sm:block">
              {user?.name}
            </span>
            <ChevronDown className="h-4 w-4 text-[#6B6B6B]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#D8D4C8] shadow-lg py-1 z-10 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EDEAE2]">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">{user?.name}</p>
                <p className="text-xs text-[#6B6B6B] truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1
            className="text-4xl leading-tight text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back,{" "}
            <span className="italic text-[#6B6B6B]">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-[#6B6B6B] mt-3">
            {workspaces.length === 0
              ? "Create your first workspace to start building boards."
              : "Here's what your team has been working on."}
          </p>
        </div>

        {workspaces.length === 0 ? (
          // Empty state — dark card, matching the reference's photo-card treatment
          <div className="relative rounded-3xl bg-[#111111] overflow-hidden flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-5">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <h2
              className="text-white text-2xl mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No workspaces <span className="italic text-white/50">yet</span>
            </h2>
            <p className="text-sm text-white/50 max-w-sm mb-7">
              A workspace holds your team's boards. Create one to invite members and start moving cards in real time.
            </p>
            <button className="flex items-center gap-2 bg-white text-[#111111] text-sm font-medium px-5 py-3 rounded-full hover:bg-white/90 transition">
              <Plus className="h-4 w-4" />
              Create workspace
            </button>
          </div>
        ) : (
          // Workspace grid (once API is wired up)
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                className="relative text-left bg-[#111111] rounded-2xl p-6 hover:brightness-110 transition group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-semibold">
                    {ws.name[0]?.toUpperCase()}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition">
                    <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <p className="font-medium text-white">{ws.name}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {ws.boardCount} board{ws.boardCount !== 1 ? "s" : ""}
                </p>
              </button>
            ))}
            <button className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#C4BFAF] rounded-2xl p-6 text-[#6B6B6B] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition">
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">New workspace</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;