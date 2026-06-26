import { Vote, Bell, LogOut, Calendar, Users, CheckCircle2, Clock, BarChart3, FileText, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function OfficerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Election Officer Portal</p>
                <p className="text-sm text-gray-500">Welcome, {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Election Officer Dashboard</h1>
          <p className="text-gray-600">Manage elections under your assigned scope</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">Active Elections</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">450</p>
                <p className="text-sm text-gray-500">Registered Voters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">328</p>
                <p className="text-sm text-gray-500">Votes Cast</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">48h</p>
                <p className="text-sm text-gray-500">Time Remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Current Election Progress</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">SRC Elections 2024</span>
                <span className="text-sm text-gray-500">73% turnout</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Faculty of Engineering Election</span>
                <span className="text-sm text-gray-500">45% turnout</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-600 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-2">Phase 1 - Foundation Complete</h2>
              <p className="text-purple-100">Full election management features coming in Phase 2.</p>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-medium">
              <FileText className="w-5 h-5" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
