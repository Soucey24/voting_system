import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  StopCircle,
  Eye,
  AlertCircle,
  Clock,
  Users,
  UserCheck,
  DollarSign,
  BarChart3,
  FileText,
  Target,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Vote,
  ShieldCheck,
  Mail,
  CheckCircle,
  XCircle,
  TrendingUp,
  CreditCard,
  UserPlus,
  Calendar,
  Crown,
} from 'lucide-react';

interface ElectionDetails {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'active' | 'paused' | 'closed';
  academic_year: string;
  category: string;
  voting_start: string;
  voting_end: string;
  total_voters: number;
  total_votes_cast: number;
  candidates_count: number;
  positions_count: number;
}

interface Position {
  id: string;
  title: string;
  candidates_count: number;
  slots: number;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: 'approved' | 'pending' | 'rejected';
  votes: number;
}

interface Payment {
  id: string;
  candidate: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  faculty: string;
  has_voted: boolean;
}

type Section =
  | 'overview'
  | 'positions'
  | 'candidates'
  | 'payments'
  | 'students'
  | 'turnout'
  | 'results';

const MOCK_POSITIONS: Position[] = [
  { id: '1', title: 'President', candidates_count: 4, slots: 1 },
  { id: '2', title: 'Vice President', candidates_count: 5, slots: 1 },
  { id: '3', title: 'Secretary', candidates_count: 3, slots: 1 },
  { id: '4', title: 'Treasurer', candidates_count: 3, slots: 1 },
];

const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Chioma Okafor', position: 'President', status: 'approved', votes: 1200 },
  { id: '2', name: 'Adeyemi Adebayo', position: 'President', status: 'approved', votes: 980 },
  { id: '3', name: 'Ibrahim Hassan', position: 'Vice President', status: 'approved', votes: 1150 },
  { id: '4', name: 'Folake Johnson', position: 'Vice President', status: 'pending', votes: 0 },
  { id: '5', name: 'Zainab Mohammed', position: 'Secretary', status: 'approved', votes: 1400 },
  { id: '6', name: 'Peter Adeleke', position: 'Secretary', status: 'rejected', votes: 0 },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', candidate: 'Chioma Okafor', amount: 500, status: 'success', date: '2026-06-15' },
  { id: '2', candidate: 'Adeyemi Adebayo', amount: 500, status: 'success', date: '2026-06-15' },
  { id: '3', candidate: 'Ibrahim Hassan', amount: 500, status: 'pending', date: '2026-06-16' },
  { id: '4', candidate: 'Folake Johnson', amount: 500, status: 'failed', date: '2026-06-16' },
];

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Amaka Eze', email: 'amaka@uni.edu', faculty: 'Engineering', has_voted: true },
  { id: '2', name: 'Tunde Bakare', email: 'tunde@uni.edu', faculty: 'Engineering', has_voted: false },
  { id: '3', name: 'Ifeoma Nwosu', email: 'ifeoma@uni.edu', faculty: 'Sciences', has_voted: true },
  { id: '4', name: 'Kelechi Opara', email: 'kelechi@uni.edu', faculty: 'Arts', has_voted: false },
];

export function ElectionManagementNewPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [election, setElection] = useState<ElectionDetails>({
    id: electionId || '1',
    title: 'Student Council Elections 2024',
    status: 'active',
    academic_year: '2024/2025',
    category: 'university',
    voting_start: '2024-06-20T09:00:00',
    voting_end: '2024-07-01T17:00:00',
    total_voters: 5000,
    total_votes_cast: 3200,
    candidates_count: 15,
    positions_count: 4,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'publish' | 'pause' | 'resume' | 'close' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState<Section>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Election is in draft mode and not visible to voters';
      case 'published':
        return 'Election is published but voting has not started yet';
      case 'active':
        return 'Election is currently live and voters can cast their votes';
      case 'paused':
        return 'Voting is temporarily paused';
      case 'closed':
        return 'Election has ended and no more votes can be accepted';
      default:
        return '';
    }
  };

  const handleAction = (selectedAction: 'publish' | 'pause' | 'resume' | 'close') => {
    setAction(selectedAction);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (!action) return;

    let newStatus: ElectionDetails['status'] = election.status;
    let message = '';

    switch (action) {
      case 'publish':
        newStatus = 'published';
        message = 'Election published successfully! Voters can now see it.';
        break;
      case 'pause':
        newStatus = 'paused';
        message = 'Voting paused. Voters cannot cast votes until resumed.';
        break;
      case 'resume':
        newStatus = 'active';
        message = 'Voting resumed. Voters can cast votes again.';
        break;
      case 'close':
        newStatus = 'closed';
        message = 'Election closed. No more votes will be accepted.';
        break;
    }

    setElection((prev) => ({ ...prev, status: newStatus }));
    setShowConfirmModal(false);
    setAction(null);
    alert(message);
  };

  const availableActions: Array<{
    id: 'publish' | 'pause' | 'resume' | 'close';
    label: string;
    icon: React.ReactNode;
    color: string;
    condition: boolean;
  }> = [
    {
      id: 'publish',
      label: 'Publish',
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      condition: election.status === 'draft',
    },
    {
      id: 'pause',
      label: 'Pause',
      icon: <Pause className="w-4 h-4" />,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      condition: election.status === 'active',
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: <Play className="w-4 h-4" />,
      color: 'bg-green-600 hover:bg-green-700',
      condition: election.status === 'paused',
    },
    {
      id: 'close',
      label: 'Close',
      icon: <StopCircle className="w-4 h-4" />,
      color: 'bg-red-600 hover:bg-red-700',
      condition: election.status === 'active' || election.status === 'paused',
    },
  ];

  const activeActions = availableActions.filter((a) => a.condition);

  const navItems: { key: Section; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'positions', label: 'Positions', icon: <Target className="w-5 h-5" />, badge: MOCK_POSITIONS.length },
    { key: 'candidates', label: 'Candidates', icon: <UserCheck className="w-5 h-5" />, badge: MOCK_CANDIDATES.length },
    { key: 'payments', label: 'Payments', icon: <DollarSign className="w-5 h-5" />, badge: MOCK_PAYMENTS.length },
    { key: 'students', label: 'Students', icon: <Users className="w-5 h-5" />, badge: MOCK_STUDENTS.length },
    { key: 'turnout', label: 'Turnout', icon: <BarChart3 className="w-5 h-5" /> },
    { key: 'results', label: 'Results', icon: <FileText className="w-5 h-5" /> },
  ];

  const hoursRemaining = Math.max(
    0,
    Math.ceil((new Date(election.voting_end).getTime() - Date.now()) / (1000 * 60 * 60))
  );
  const turnoutPct = Math.round((election.total_votes_cast / election.total_voters) * 100);

  const sectionTitle: Record<Section, string> = {
    overview: 'Election Overview',
    positions: 'Positions',
    candidates: 'Candidates',
    payments: 'Payments',
    students: 'Student Roster',
    turnout: 'Voter Turnout',
    results: 'Results',
  };

  const sectionSubtitle: Record<Section, string> = {
    overview: 'Snapshot of the election and its current status',
    positions: 'Define and manage the positions up for election',
    candidates: 'Review and approve candidate applications',
    payments: 'Track candidate application payments',
    students: 'Manage the eligible student voter list',
    turnout: 'Real-time participation metrics',
    results: 'Tally votes and publish official results',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{election.title}</p>
              <p className="text-[11px] text-gray-500 truncate">Election Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-gray-900/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="p-6 border-b hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{election.title}</p>
                <p className="text-xs text-gray-500">Election Management</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 lg:py-6 px-3 overflow-y-auto pt-20 lg:pt-6 space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 font-medium'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {sectionTitle[active]}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                      election.status
                    )}`}
                  >
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{sectionSubtitle[active]}</p>
              </div>
              {activeActions.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {activeActions.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleAction(btn.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-lg transition-colors ${btn.color}`}
                    >
                      {btn.icon}
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">{getStatusMessage(election.status)}</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* OVERVIEW */}
          {active === 'overview' && (
            <>
              {/* Hero card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">{election.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {election.academic_year} • {election.category}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      election.status
                    )}`}
                  >
                    {election.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <InfoCell label="Voting Start" value={new Date(election.voting_start).toLocaleString()} />
                  <InfoCell label="Voting End" value={new Date(election.voting_end).toLocaleString()} />
                  <InfoCell
                    label="Time Remaining"
                    value={`${hoursRemaining} hours`}
                    icon={<Clock className="w-4 h-4 text-purple-600" />}
                  />
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Total Voters"
                  value={election.total_voters.toLocaleString()}
                  color="blue"
                />
                <StatCard
                  icon={<CheckCircle className="w-6 h-6" />}
                  label="Votes Cast"
                  value={election.total_votes_cast.toLocaleString()}
                  color="purple"
                />
                <StatCard
                  icon={<UserCheck className="w-6 h-6" />}
                  label="Candidates"
                  value={election.candidates_count}
                  color="green"
                />
                <StatCard
                  icon={<Target className="w-6 h-6" />}
                  label="Positions"
                  value={election.positions_count}
                  color="orange"
                />
              </div>

              {/* Lifecycle */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-5">Election Lifecycle</h3>
                <div className="space-y-3">
                  {[
                    { status: 'draft', label: 'Draft', description: 'Election created and being configured' },
                    { status: 'published', label: 'Published', description: 'Election is visible to students' },
                    { status: 'active', label: 'Active', description: 'Voting is in progress' },
                    { status: 'paused', label: 'Paused', description: 'Voting temporarily stopped' },
                    { status: 'closed', label: 'Closed', description: 'Election ended, results ready' },
                  ].map((stage) => {
                    const isCurrent = election.status === stage.status;
                    return (
                      <div
                        key={stage.status}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${
                          isCurrent ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            isCurrent ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {isCurrent ? <CheckCircle className="w-5 h-5" /> : stage.label[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{stage.label}</p>
                          <p className="text-xs text-gray-500">{stage.description}</p>
                        </div>
                        {isCurrent && (
                          <span className="text-xs font-semibold text-purple-700">Current</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* POSITIONS */}
          {active === 'positions' && (
            <Panel
              title="Positions"
              count={MOCK_POSITIONS.length}
              fullPageLink={`/officer/election/${electionId}/positions`}
            >
              <ul className="divide-y divide-gray-100">
                {MOCK_POSITIONS.map((pos) => (
                  <li key={pos.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{pos.title}</p>
                        <p className="text-xs text-gray-500">
                          {pos.candidates_count} candidates • {pos.slots} slot
                          {pos.slots === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* CANDIDATES */}
          {active === 'candidates' && (
            <Panel
              title="Candidates"
              count={MOCK_CANDIDATES.length}
              fullPageLink={`/officer/election/${electionId}/candidates`}
            >
              <ul className="divide-y divide-gray-100">
                {MOCK_CANDIDATES.map((c) => {
                  const badge =
                    c.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : c.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700';
                  return (
                    <li key={c.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-semibold text-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {c.position} • {c.votes.toLocaleString()} votes
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${badge}`}
                      >
                        {c.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          {/* PAYMENTS */}
          {active === 'payments' && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<CheckCircle className="w-6 h-6" />}
                  label="Successful"
                  value={MOCK_PAYMENTS.filter((p) => p.status === 'success').length}
                  color="green"
                />
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  label="Pending"
                  value={MOCK_PAYMENTS.filter((p) => p.status === 'pending').length}
                  color="orange"
                />
                <StatCard
                  icon={<XCircle className="w-6 h-6" />}
                  label="Failed"
                  value={MOCK_PAYMENTS.filter((p) => p.status === 'failed').length}
                  color="red"
                />
              </div>
              <Panel
                title="Recent Payments"
                count={MOCK_PAYMENTS.length}
                fullPageLink={`/officer/election/${electionId}/payments`}
              >
                <ul className="divide-y divide-gray-100">
                  {MOCK_PAYMENTS.map((p) => {
                    const badge =
                      p.status === 'success'
                        ? 'bg-emerald-100 text-emerald-700'
                        : p.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700';
                    const Icon =
                      p.status === 'success'
                        ? CheckCircle
                        : p.status === 'pending'
                        ? Clock
                        : XCircle;
                    return (
                      <li key={p.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              p.status === 'success'
                                ? 'bg-emerald-100 text-emerald-600'
                                : p.status === 'pending'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{p.candidate}</p>
                            <p className="text-xs text-gray-500">
                              ₦{p.amount.toLocaleString()} • {p.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${badge}`}
                        >
                          <Icon className="w-3 h-3" />
                          {p.status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            </>
          )}

          {/* STUDENTS */}
          {active === 'students' && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Registered"
                  value={election.total_voters.toLocaleString()}
                  color="blue"
                />
                <StatCard
                  icon={<CheckCircle className="w-6 h-6" />}
                  label="Voted"
                  value={election.total_votes_cast.toLocaleString()}
                  color="green"
                />
                <StatCard
                  icon={<UserPlus className="w-6 h-6" />}
                  label="Yet to Vote"
                  value={(election.total_voters - election.total_votes_cast).toLocaleString()}
                  color="orange"
                />
              </div>
              <Panel
                title="Sample Student Roster"
                count={`${MOCK_STUDENTS.length} of ${election.total_voters.toLocaleString()}`}
                fullPageLink={`/officer/election/${electionId}/students`}
              >
                <ul className="divide-y divide-gray-100">
                  {MOCK_STUDENTS.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-semibold text-sm">
                          {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{s.name}</p>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {s.email} • {s.faculty}
                          </p>
                        </div>
                      </div>
                      {s.has_voted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Voted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}

          {/* TURNOUT */}
          {active === 'turnout' && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="Turnout"
                  value={`${turnoutPct}%`}
                  color="purple"
                />
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Votes Cast"
                  value={election.total_votes_cast.toLocaleString()}
                  color="blue"
                />
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  label="Hours Left"
                  value={hoursRemaining.toLocaleString()}
                  color="orange"
                />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Live Participation</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${turnoutPct}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {election.total_votes_cast.toLocaleString()} of{' '}
                  {election.total_voters.toLocaleString()} registered voters have cast their ballots
                </p>
              </div>
              <Link
                to={`/officer/election/${electionId}/turnout`}
                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Open full turnout monitor
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {/* RESULTS */}
          {active === 'results' && (
            <>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Publish Official Results</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Tally votes, audit outcomes, and publish the official results.
                </p>
                <Link
                  to={`/officer/election/${electionId}/results`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Open Results Publisher
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Preview</h3>
                <div className="space-y-3">
                  {MOCK_POSITIONS.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{p.title}</span>
                      <span className="text-gray-500">{p.candidates_count} candidates</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && action && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {action === 'publish' && 'Publish Election?'}
                {action === 'pause' && 'Pause Voting?'}
                {action === 'resume' && 'Resume Voting?'}
                {action === 'close' && 'Close Election?'}
              </h3>

              <p className="text-gray-700 mb-6">
                {action === 'publish' && 'Make this election visible to all students?'}
                {action === 'pause' && 'Pause voting temporarily? Students will not be able to vote.'}
                {action === 'resume' && 'Resume voting? Students can cast votes again.'}
                {action === 'close' &&
                  'Close this election? This action cannot be undone and no more votes will be accepted.'}
              </p>

              {action === 'close' && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                  <p className="text-sm text-red-800">
                    <span className="font-bold">Warning:</span> Closing the election cannot be
                    reversed. Make sure voting period has ended.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setAction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    action === 'close'
                      ? 'bg-red-600 hover:bg-red-700'
                      : action === 'pause'
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) {
  const colorMap: Record<typeof color, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function Panel({
  title,
  count,
  fullPageLink,
  children,
}: {
  title: string;
  count?: string | number;
  fullPageLink?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {typeof count !== 'undefined' && (
            <p className="text-xs text-gray-500 mt-0.5">
              {count} {typeof count === 'number' ? 'items' : ''}
            </p>
          )}
        </div>
        {fullPageLink && (
          <Link
            to={fullPageLink}
            className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}