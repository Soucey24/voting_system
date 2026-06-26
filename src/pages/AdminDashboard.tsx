import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Shield,
  Settings,
  Menu,
  X,
  Vote,
  LogOut,
  TrendingUp,
  UserCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { FacultyManagement } from './admin/FacultyManagement';
import { DepartmentManagement } from './admin/DepartmentManagement';
import { StudentImport } from './admin/StudentImport';
import { UserManagement } from './admin/UserManagement';

interface DashboardStats {
  totalStudents: number;
  totalFaculties: number;
  totalDepartments: number;
  totalOfficers: number;
  totalAuditors: number;
  registeredStudents: number;
  faceEnrolledStudents: number;
}

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [studentsResult, facultiesResult, departmentsResult, officersResult, auditorsResult, registeredResult, faceEnrolledResult] = await Promise.all([
        supabase.from('student_records').select('id', { count: 'exact', head: true }),
        supabase.from('faculties').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'election_officer'),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'auditor'),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'student').eq('is_face_enrolled', true),
      ]);

      setStats({
        totalStudents: studentsResult.count || 0,
        totalFaculties: facultiesResult.count || 0,
        totalDepartments: departmentsResult.count || 0,
        totalOfficers: officersResult.count || 0,
        totalAuditors: auditorsResult.count || 0,
        registeredStudents: registeredResult.count || 0,
        faceEnrolledStudents: faceEnrolledResult.count || 0,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'faculties', label: 'Faculties', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'students', label: 'Student Import', icon: GraduationCap },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Admin Dashboard</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">UEVS Admin</p>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-4 lg:py-6 px-3 overflow-y-auto pt-20 lg:pt-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-1 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Monitor system statistics and manage university elections</p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {[
                      { label: 'Total Students', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'bg-blue-500', change: `${stats?.registeredStudents || 0} registered` },
                      { label: 'Faculties', value: stats?.totalFaculties || 0, icon: Building2, color: 'bg-green-500', change: `${stats?.totalDepartments || 0} departments` },
                      { label: 'Election Officers', value: stats?.totalOfficers || 0, icon: Award, color: 'bg-purple-500', change: 'Active officers' },
                      { label: 'Auditors', value: stats?.totalAuditors || 0, icon: Shield, color: 'bg-orange-500', change: 'Active auditors' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-xs text-blue-600 mt-2">{stat.change}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Student Registration Status</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Face Enrolled</span>
                            <span className="text-sm font-semibold text-gray-900">{stats?.faceEnrolledStudents || 0}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${stats?.totalStudents ? ((stats.faceEnrolledStudents / stats.totalStudents) * 100) : 0}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Registered (Not Enrolled)</span>
                            <span className="text-sm font-semibold text-gray-900">{(stats?.registeredStudents || 0) - (stats?.faceEnrolledStudents || 0)}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${stats?.totalStudents ? (((stats.registeredStudents - stats.faceEnrolledStudents) / stats.totalStudents) * 100) : 0}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Not Registered</span>
                            <span className="text-sm font-semibold text-gray-900">{(stats?.totalStudents || 0) - (stats?.registeredStudents || 0)}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-300 rounded-full"
                              style={{ width: `${stats?.totalStudents ? (((stats.totalStudents - stats.registeredStudents) / stats.totalStudents) * 100) : 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Import Student Records', action: () => setActiveTab('students'), icon: GraduationCap, color: 'bg-blue-100 text-blue-600' },
                          { label: 'Manage Faculties', action: () => setActiveTab('faculties'), icon: Building2, color: 'bg-green-100 text-green-600' },
                          { label: 'Create Election Officer', action: () => setActiveTab('users'), icon: UserCheck, color: 'bg-purple-100 text-purple-600' },
                          { label: 'System Settings', action: () => setActiveTab('settings'), icon: Settings, color: 'bg-gray-100 text-gray-600' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-left"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-900">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'faculties' && <FacultyManagement />}
          {activeTab === 'departments' && <DepartmentManagement />}
          {activeTab === 'students' && <StudentImport onImport={loadStats} />}
          {activeTab === 'users' && <UserManagement onUserCreated={loadStats} />}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
              <p className="text-gray-500">System settings will be configured here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
