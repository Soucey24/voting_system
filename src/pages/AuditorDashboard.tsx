import { Bell, LogOut, Calendar, Users, FileText, Shield, Eye, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuditorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Auditor Portal</p>
                <p className="text-sm text-gray-500">Welcome, {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Auditor Dashboard</h1>
          <p className="text-gray-600">Monitor election integrity and view audit reports</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Elections Audited</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">500</p>
                <p className="text-sm text-gray-500">Votes Verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">Reports Generated</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500">Integrity Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Read-Only Access</h2>
          </div>

          <p className="text-gray-600 mb-6">
            As an auditor, you have read-only access to monitor election processes, verify vote integrity, and generate compliance reports. All actions are logged for transparency.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">View Election Results</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Generate Audit Reports</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Monitor Voting Activity</span>
            </div>
          </div>
        </div>

        <div className="bg-green-600 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-2">Phase 1 - Foundation Complete</h2>
              <p className="text-green-100">Full auditor functionality coming in Phase 2.</p>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-medium">
              <Eye className="w-5 h-5" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
