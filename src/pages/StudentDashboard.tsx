import { Vote, Calendar, CheckCircle2, Clock, ArrowRight, Trophy, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function StudentDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">UEVS Student Portal</p>
                <p className="text-sm text-gray-500">Welcome, {user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">View upcoming elections and cast your vote</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Verified</p>
                <p className="text-sm text-gray-500">Account Status</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Your account is fully verified and ready to vote.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Upcoming Elections</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">You have 3 elections scheduled for the coming weeks.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-500">Votes Cast</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">You have participated in 1 previous election.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Elections</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {[
                { title: 'SRC Elections 2024', date: 'Jan 15 - Jan 20, 2024', status: 'Active', type: 'SRC' },
                { title: 'Faculty of Engineering Election', date: 'Jan 25, 2024', status: 'Upcoming', type: 'Faculty' },
                { title: 'Computer Science Department Election', date: 'Feb 1, 2024', status: 'Upcoming', type: 'Department' },
              ].map((election) => (
                <div key={election.title} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      election.type === 'SRC' ? 'bg-blue-100' : election.type === 'Faculty' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Vote className={`w-6 h-6 ${
                        election.type === 'SRC' ? 'text-blue-600' : election.type === 'Faculty' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{election.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{election.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      election.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {election.status}
                    </span>
                    {election.status === 'Active' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        <span>Vote</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-2">Ready to Vote?</h2>
              <p className="text-blue-100">View candidates, read manifestos, and make your voice heard.</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-semibold transition-colors">
              <span>Browse Elections</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
