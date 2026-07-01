import { useState } from "react";
import {
  Home,
  Vote as VoteIcon,
  FolderClosed,
  Award,
  Megaphone,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import htuLogo from "../../assets/HTU.png";

interface StudentSidebarProps {
  collapsed: boolean;
  activeItem?: string;
  onSelect?: (item: string) => void;
}

export function StudentSidebar({
  collapsed,
  activeItem = "dashboard",
  onSelect,
}: StudentSidebarProps) {
  const { logout } = useAuth();
  const [resultsOpen, setResultsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const handleSelect = (item: string) => onSelect?.(item);

  const itemBase =
    "flex items-center gap-3 w-full rounded-lg font-medium transition-colors";
  const paddedRow = collapsed ? "px-3 py-3 justify-center" : "px-4 py-3";

  const activeClass = "bg-white text-blue-700 shadow-md";
  const idleClass = "text-blue-100 hover:bg-blue-800/60 hover:text-white";

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-[#1e40af] text-white h-screen sticky top-0 flex flex-col overflow-hidden ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800/40">
        <img
          src={htuLogo}
          alt="HTU"
          className="w-12 h-12 rounded-xl bg-white p-1 shadow flex-shrink-0"
        />
        {!collapsed && (
          <div className="leading-tight whitespace-nowrap">
            <p className="text-xl font-extrabold tracking-wide">HTU</p>
            <p className="text-[11px] text-blue-200 tracking-widest">
              E-VOTING SYSTEM
            </p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {!collapsed && (
          <p className="text-xs text-blue-300 tracking-widest mb-3 px-2">
            MAIN MENU
          </p>
        )}

        <nav className="space-y-1">
          <button
            onClick={() => handleSelect("dashboard")}
            className={`${itemBase} ${paddedRow} ${
              activeItem === "dashboard" ? activeClass : idleClass
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handleSelect("vote")}
            className={`${itemBase} ${paddedRow} ${
              activeItem === "vote" ? activeClass : idleClass
            }`}
          >
            <VoteIcon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Vote</span>}
          </button>

          {/* Election Results dropdown */}
          <div>
            <button
              onClick={() => setResultsOpen((o) => !o)}
              className={`${itemBase} ${paddedRow} ${idleClass} ${
                !collapsed ? "justify-between" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderClosed className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>Election Results</span>}
              </span>
              {!collapsed &&
                (resultsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </button>
            {!collapsed && resultsOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {[
                  ["general", "General Election Result"],
                  ["faculty", "Faculty Election Result"],
                  ["department", "Department Election Result"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-colors"
                  >
                    <Circle className="w-2 h-2" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleSelect("slots")}
            className={`${itemBase} ${paddedRow} ${idleClass} ${
              !collapsed ? "justify-between" : ""
            }`}
          >
            <span className="flex items-center gap-3">
              <Award className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Slots</span>}
            </span>
            {!collapsed && (
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                CLOSED
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelect("announcement")}
            className={`${itemBase} ${paddedRow} ${idleClass}`}
          >
            <Megaphone className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Announcement</span>}
          </button>
        </nav>

        {/* Account */}
        <div className="mt-8">
          {!collapsed && (
            <p className="text-xs text-blue-300 tracking-widest mb-3 px-2">
              ACCOUNT
            </p>
          )}
          <div className="space-y-1">
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className={`${itemBase} ${paddedRow} ${idleClass} ${
                !collapsed ? "justify-between" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>Settings</span>}
              </span>
              {!collapsed &&
                (settingsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </button>
            {!collapsed && settingsOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  onClick={() => handleSelect("reset-password")}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-colors"
                >
                  <Circle className="w-2 h-2" />
                  <span>Reset Password</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t border-blue-800/40">
        <button
          onClick={logout}
          className={`${itemBase} ${paddedRow} ${idleClass}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
