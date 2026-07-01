import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";
import { SlotManagementPage } from "./SlotManagementPage";
import { ElectionCreationPage } from "./ElectionCreationPage";
import { CandidateApprovalPage } from "./CandidateApprovalPage";
import { ElectionMonitoringPage } from "./ElectionMonitoringPage";
import { ElectionResultsPage } from "./ElectionResultsPage";
import { ElectionReportsPage } from "./ElectionReportsPage";
import { StudentRecordsPage } from "./StudentRecordsPage";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "fa-solid fa-house" },
  {
    id: "create-election",
    label: "Create Elections",
    icon: "fa-solid fa-square-plus",
  },
  {
    id: "positions",
    label: "Create Slots",
    icon: "fa-solid fa-list-check",
  },
  {
    id: "pending-approvals",
    label: "Pending Approvals",
    icon: "fa-solid fa-user-clock",
  },
  {
    id: "approved",
    label: "Approved Candidates",
    icon: "fa-solid fa-user-check",
  },
  {
    id: "monitoring",
    label: "Election Monitoring",
    icon: "fa-solid fa-chart-line",
  },
  { id: "results", label: "Results", icon: "fa-solid fa-trophy" },
  { id: "reports", label: "Reports", icon: "fa-solid fa-file-lines" },
  {
    id: "students",
    label: "Student Records",
    icon: "fa-solid fa-graduation-cap",
  },
];

const summaryCards = [
  {
    title: "Active Elections",
    value: "1",
    icon: "fa-solid fa-calendar-days",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    title: "Pending Applications",
    value: "24",
    icon: "fa-solid fa-hourglass-half",
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    title: "Approved Candidates",
    value: "56",
    icon: "fa-solid fa-user-check",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Votes Cast",
    value: "1,243",
    icon: "fa-solid fa-chart-simple",
    iconBg: "bg-violet-100 text-violet-600",
  },
];

export function ElectionOfficerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 w-64 bg-blue-900 text-white p-6 shadow-lg h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">UEVS</h1>
          <p className="text-blue-200 text-sm">Election Officer</p>
        </div>

        <nav className="space-y-2 mb-8 overflow-hidden">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <span className="w-5 text-center text-sm">
                <i className={`${item.icon}`} />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8 h-screen overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab === "dashboard" ? "Dashboard" : "Election Management"}
            </h2>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.full_name || "Officer"}
            </p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {summaryCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.iconBg} p-3 rounded-lg`}>
                      <i className={`${card.icon}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Election Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Election Name</p>
                  <p className="text-gray-900 font-semibold">
                    SRC General Election 2025
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-green-600 font-semibold">LIVE</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Eligible Voters</p>
                  <p className="text-gray-900 font-semibold">5,000</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "create-election" ? (
          <ElectionCreationPage />
        ) : activeTab === "positions" ? (
          <SlotManagementPage />
        ) : activeTab === "pending-approvals" ? (
          <CandidateApprovalPage />
        ) : activeTab === "monitoring" ? (
          <ElectionMonitoringPage />
        ) : activeTab === "results" ? (
          <ElectionResultsPage />
        ) : activeTab === "reports" ? (
          <ElectionReportsPage />
        ) : activeTab === "students" ? (
          <StudentRecordsPage />
        ) : activeTab !== "dashboard" ? (
          <div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
            <i className="fa-solid fa-construction text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              The {sidebarItems.find((item) => item.id === activeTab)?.label}{" "}
              module is under development.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
