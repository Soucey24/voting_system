import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house' },
  { id: 'create-election', label: 'Create Elections', icon: 'fa-solid fa-square-plus' },
  { id: 'positions', label: 'Election Positions (Slots)', icon: 'fa-solid fa-list-check' },
  { id: 'applications', label: 'Candidate Applications', icon: 'fa-solid fa-user-plus' },
  { id: 'approved', label: 'Approved Candidates', icon: 'fa-solid fa-user-check' },
  { id: 'monitoring', label: 'Election Monitoring', icon: 'fa-solid fa-chart-line' },
  { id: 'results', label: 'Results', icon: 'fa-solid fa-trophy' },
  { id: 'reports', label: 'Reports', icon: 'fa-solid fa-file-lines' },
  { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

const summaryCards = [
  {
    title: 'Active Elections',
    value: '1',
    icon: 'fa-solid fa-calendar-days',
    iconBg: 'bg-blue-100 text-blue-600',
    action: 'View Details →',
  },
  {
    title: 'Pending Applications',
    value: '24',
    icon: 'fa-solid fa-hourglass-half',
    iconBg: 'bg-orange-100 text-orange-600',
    action: 'Review Now →',
  },
  {
    title: 'Approved Candidates',
    value: '56',
    icon: 'fa-solid fa-user-check',
    iconBg: 'bg-emerald-100 text-emerald-600',
    action: 'View Candidates →',
  },
  {
    title: 'Votes Cast',
    value: '1,243',
    icon: 'fa-solid fa-chart-simple',
    iconBg: 'bg-violet-100 text-violet-600',
    action: 'Live Monitoring →',
  },
  {
    title: 'Election Status',
    value: 'LIVE',
    icon: 'fa-solid fa-bolt',
    iconBg: 'bg-cyan-100 text-cyan-600',
    action: 'View Status →',
  },
];

const quickActions = [
  { label: 'Create Election', icon: 'fa-solid fa-plus', color: 'bg-blue-600 text-white' },
  { label: 'Open Applications', icon: 'fa-solid fa-folder-open', color: 'bg-emerald-600 text-white' },
  { label: 'Open Election', icon: 'fa-solid fa-play', color: 'bg-violet-600 text-white' },
  { label: 'View Live Results', icon: 'fa-solid fa-eye', color: 'bg-orange-500 text-white' },
];

const applicationRows = [
  {
    name: 'Amina Yusuf',
    id: 'STU-00521',
    position: 'President',
    department: 'Computer Science',
    date: 'Jun 26, 2025',
    status: 'Pending',
    statusClass: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'David Nwosu',
    id: 'STU-00614',
    position: 'Vice President',
    department: 'Engineering',
    date: 'Jun 25, 2025',
    status: 'Approved',
    statusClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Sara Bello',
    id: 'STU-00702',
    position: 'General Secretary',
    department: 'Law',
    date: 'Jun 24, 2025',
    status: 'Pending',
    statusClass: 'bg-orange-100 text-orange-700',
  },
];

const overviewItems = [
  { label: 'Election Name', value: 'SRC General Election 2025', icon: 'fa-solid fa-bullhorn' },
  { label: 'Academic Year', value: '2024 / 2025', icon: 'fa-solid fa-graduation-cap' },
  { label: 'Start Date', value: 'May 20, 2025', icon: 'fa-solid fa-calendar-check' },
  { label: 'End Date', value: 'May 30, 2025', icon: 'fa-solid fa-calendar-xmark' },
  { label: 'Eligible Voters', value: '5,000', icon: 'fa-solid fa-users' },
  { label: 'Positions Contested', value: '12', icon: 'fa-solid fa-list' },
  { label: 'Status', value: 'LIVE', icon: 'fa-solid fa-circle-check', badge: true },
];

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { user } = useAuth();
  const profileName = user?.full_name || 'Election Officer';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#1E3A8A] text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 py-8">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/10 text-white shadow-soft">
                <i className="fa-solid fa-shield-halved text-xl" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-semibold">Student Election</p>
                <p className="text-sm text-slate-200/90">Management System</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-sm transition ${
                    activeMenu === item.id
                      ? 'bg-[#2563EB] text-white shadow-[0_10px_30px_-20px_rgba(37,99,235,0.7)]'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/10 text-slate-100">
                    <i className={`${item.icon} text-base`} aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="rounded-[20px] bg-white/10 px-4 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{profileName}</p>
                <p className="text-xs text-slate-200/80">Election Officer</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-xs text-emerald-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="lg:ml-[260px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              >
                <i className="fa-solid fa-bars text-lg" aria-hidden="true" />
              </button>
              <div>
                <p className="text-sm text-slate-500">Welcome back,</p>
                <h1 className="text-xl font-semibold text-slate-900">{profileName} 👋</h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="relative inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-slate-100 text-slate-700 shadow-sm">
                <i className="fa-solid fa-bell" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">3</span>
              </button>

              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Current Election</p>
                <p className="font-semibold text-slate-900">SRC General Election 2025</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  <i className="fa-solid fa-circle text-[8px] mr-2 text-emerald-600" aria-hidden="true" /> LIVE
                </span>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <i className="fa-solid fa-chevron-down text-slate-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid gap-5 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
            {summaryCards.map((card) => (
              <article key={card.title} className="rounded-[16px] bg-white p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${card.iconBg}`}>
                    <i className={`${card.icon} text-lg`} aria-hidden="true" />
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-400" aria-hidden="true" />
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4 text-sm font-semibold text-slate-600">{card.action}</div>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[65%_35%]">
            <div className="space-y-6">
              <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">Votes Overview</p>
                    <p className="mt-1 text-sm text-slate-500">Real-time election progress</p>
                  </div>
                  <div className="rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    This Election
                    <i className="fa-solid fa-chevron-down ml-2 text-slate-400" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Votes Cast', value: '1,243' },
                    { label: 'Eligible voters', value: '5,000' },
                    { label: 'Turnout Percentage', value: '24.86%' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>24.86% turnout</span>
                    <span>1,243 votes</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[24.86%] rounded-full bg-[#2563EB]" />
                  </div>
                </div>

                <div className="mt-8 rounded-[20px] bg-[#F8FAFC] p-4 shadow-inner">
                  <svg viewBox="0 0 720 240" className="h-56 w-full overflow-visible">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="40,180 120,140 200,155 280,115 360,140 440,100 520,120 600,80"
                    />
                    {[40, 120, 200, 280, 360, 440, 520, 600].map((x, index) => (
                      <g key={x}>
                        <circle cx={x} cy={[180, 140, 155, 115, 140, 100, 120, 80][index]} r="6" fill="#2563EB" />
                      </g>
                    ))}
                    <line x1="40" y1="40" x2="40" y2="180" stroke="#CBD5E1" strokeWidth="1" />
                    <line x1="40" y1="180" x2="600" y2="180" stroke="#CBD5E1" strokeWidth="1" />
                  </svg>
                  <div className="mt-4 grid grid-cols-8 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    {['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'].map((label) => (
                      <span key={label} className="text-center">{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">Votes by Position</p>
                    <p className="mt-1 text-sm text-slate-500">Live vote distribution</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                  <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-[#F8FAFC]">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(#2563EB_0_20%,#8B5CF6_20%_40%,#F59E0B_40%_60%,#FBBF24_60%_80%,#CBD5E1_80%_100%)]" />
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-sm">
                      <div className="text-center">
                        <p className="text-3xl font-semibold text-slate-900">1,243</p>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Votes</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { label: 'President', value: '34%', count: '422', color: 'bg-blue-500' },
                      { label: 'Vice President', value: '22%', count: '273', color: 'bg-violet-500' },
                      { label: 'General Secretary', value: '18%', count: '224', color: 'bg-orange-500' },
                      { label: 'Financial Secretary', value: '14%', count: '174', color: 'bg-yellow-500' },
                      { label: 'Others', value: '12%', count: '150', color: 'bg-slate-400' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-[16px] bg-slate-50 p-4">
                        <span className={`inline-flex h-3.5 w-3.5 rounded-full ${item.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.value} • {item.count} votes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">Election Countdown</p>
                    <p className="mt-1 text-sm text-slate-500">Next milestone for the current election</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Days', value: '04' },
                    { label: 'Hours', value: '12' },
                    { label: 'Minutes', value: '32' },
                    { label: 'Seconds', value: '18' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] bg-slate-50 p-4 text-center">
                      <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-[16px] bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Election ends on:</p>
                  <p className="mt-2">May 30, 2025 • 6:00 PM</p>
                </div>
              </div>

              <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
                <div>
                  <p className="text-base font-semibold text-slate-900">Quick Actions</p>
                  <p className="mt-1 text-sm text-slate-500">Manage election flow with one tap</p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className={`flex min-h-[96px] items-center justify-center gap-3 rounded-[16px] p-4 text-center font-semibold shadow-sm transition ${action.color}`}
                    >
                      <i className={`${action.icon} text-xl`} aria-hidden="true" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[70%_30%]">
            <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">Recent Applications</p>
                  <p className="mt-1 text-sm text-slate-500">Review the latest candidate submissions</p>
                </div>
                <button className="text-sm font-semibold text-blue-600">View All →</button>
              </div>
              <div className="mt-6 overflow-hidden rounded-[16px] border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-slate-500">Candidate</th>
                      <th className="px-5 py-4 font-semibold text-slate-500">Position</th>
                      <th className="px-5 py-4 font-semibold text-slate-500">Department</th>
                      <th className="px-5 py-4 font-semibold text-slate-500">Date Applied</th>
                      <th className="px-5 py-4 font-semibold text-slate-500">Status</th>
                      <th className="px-5 py-4 font-semibold text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {applicationRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=2563EB&color=ffffff`}
                                alt={row.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{row.name}</p>
                              <p className="text-xs text-slate-500">{row.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-700">{row.position}</td>
                        <td className="px-5 py-4 text-slate-700">{row.department}</td>
                        <td className="px-5 py-4 text-slate-700">{row.date}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.statusClass}`}>{row.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Review</button>
                            <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[16px] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.25)]">
              <div>
                <p className="text-base font-semibold text-slate-900">Election Overview</p>
                <p className="mt-1 text-sm text-slate-500">Core details at a glance</p>
              </div>
              <div className="mt-6 space-y-4">
                {overviewItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 rounded-[16px] bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <i className={`${item.icon} text-base`} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">LIVE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
