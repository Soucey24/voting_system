import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Vote,
  LogOut,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  Plus,
  Settings,
  LayoutDashboard,
  FileText,
  Bell,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOfficerElections, getActiveElections, getUpcomingElections, getCompletedElections } from '../services/election';
import { StatisticCard } from '../components/officer/StatisticCard';
import { ElectionCard } from '../components/officer/ElectionCard';
import { TurnoutMonitor } from '../components/officer/TurnoutMonitor';
import type { Election } from '../types';

// Mock mode
const MOCK_MODE = true;

// Sample mock elections
const MOCK_ELECTIONS: Election[] = [
  {
    id: '1',
    officer_id: 'officer-1',
    title: 'Student Council Elections 2024',
    description: 'Annual elections for student council positions',
    academic_year: '2024/2025',
    category: 'university',
    scope_id: undefined,
    status: 'active',
    nomination_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nomination_end: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    voting_start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    voting_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    slot_application_fee: 500,
    enable_payment: true,
    total_voters: 5000,
    total_votes_cast: 3200,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    officer_id: 'officer-1',
    title: 'Faculty Representatives Election',
    description: 'Election for faculty representatives',
    academic_year: '2024/2025',
    category: 'faculty',
    scope_id: 'faculty-1',
    status: 'published',
    nomination_start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    nomination_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    voting_start: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    voting_end: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    slot_application_fee: 300,
    enable_payment: true,
    total_voters: 1500,
    total_votes_cast: 0,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    officer_id: 'officer-1',
    title: 'Class Representatives 2024',
    description: 'Class rep elections for 2024',
    academic_year: '2024/2025',
    category: 'department',
    scope_id: 'dept-1',
    status: 'closed',
    nomination_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    nomination_end: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    voting_start: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    voting_end: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    slot_application_fee: 200,
    enable_payment: false,
    total_voters: 800,
    total_votes_cast: 650,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

type TabType = 'overview' | 'active' | 'upcoming' | 'completed';

export function OfficerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [elections, setElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load elections on mount
  useEffect(() => {
    loadElections();
  }, []);

  // Load elections when tab changes
  useEffect(() => {
    if (activeTab === 'overview') {
      loadElections();
    } else {
      filterElections(activeTab);
    }
  }, [activeTab]);

  const loadElections = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      if (MOCK_MODE) {
        // Use mock data + localStorage
        const mockElectionsFromStorage = JSON.parse(localStorage.getItem('mock_elections') || '[]');
        const allMockElections = [...MOCK_ELECTIONS, ...mockElectionsFromStorage];
        const userElections = allMockElections.filter(e => !e.officer_id || e.officer_id === user.id || e.officer_id === 'officer-1');
        
        setElections(userElections);
        setFilteredElections(userElections);
      } else {
        const data = await getOfficerElections(user.id);
        setElections(data || []);
        setFilteredElections(data || []);
      }
    } catch (error) {
      console.error('Failed to load elections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterElections = async (tab: TabType) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      let data: Election[] = [];

      if (MOCK_MODE) {
        // Filter mock data
        const mockElectionsFromStorage = JSON.parse(localStorage.getItem('mock_elections') || '[]');
        const allMockElections = [...MOCK_ELECTIONS, ...mockElectionsFromStorage];
        const userElections = allMockElections.filter(e => !e.officer_id || e.officer_id === user.id || e.officer_id === 'officer-1');

        switch (tab) {
          case 'active':
            data = userElections.filter(e => e.status === 'active');
            break;
          case 'upcoming':
            data = userElections.filter(e => e.status === 'published' || e.status === 'draft');
            break;
          case 'completed':
            data = userElections.filter(e => e.status === 'closed' || e.status === 'results_published');
            break;
        }
      } else {
        switch (tab) {
          case 'active':
            data = await getActiveElections(user.id);
            break;
          case 'upcoming':
            data = await getUpcomingElections(user.id);
            break;
          case 'completed':
            data = await getCompletedElections(user.id);
            break;
        }
      }

      setFilteredElections(data || []);
    } catch (error) {
      console.error('Failed to filter elections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeElectionsCount = elections.filter((e) => e.status === 'active').length;
  const upcomingElectionsCount = elections.filter((e) => e.status === 'draft').length;
  const completedElectionsCount = elections.filter((e) =>
    ['closed', 'results_published'].includes(e.status)
  ).length;
  const totalVoters = elections.reduce((sum, e) => sum + e.total_voters, 0);
  const totalVotesCast = elections.reduce((sum, e) => sum + e.total_votes_cast, 0);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabItems: { key: TabType; label: string; count?: number }[] = [
    { key: 'overview', label: 'All Elections', count: elections.length },
    { key: 'active', label: 'Active', count: activeElectionsCount },
    { key: 'upcoming', label: 'Upcoming', count: upcomingElectionsCount },
    { key: 'completed', label: 'Completed', count: completedElectionsCount },
  ];

  const tabTitle: Record<TabType, string> = {
    overview: 'Dashboard',
    active: 'Active Elections',
    upcoming: 'Upcoming Elections',
    completed: 'Completed Elections',
  };

  const tabSubtitle: Record<TabType, string> = {
    overview: 'Manage elections under your assigned scope',
    active: 'Elections currently open for voting',
    upcoming: 'Elections scheduled or in draft',
    completed: 'Elections that have ended',
  };

  const isInElectionsGroup = activeTab === 'overview' || activeTab === 'active' || activeTab === 'upcoming' || activeTab === 'completed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">Officer Portal</p>
              <p className="text-[11px] text-gray-500 leading-tight">{user?.full_name}</p>
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
              <div>
                <p className="font-bold text-gray-900">UEVS Officer</p>
                <p className="text-xs text-gray-500">Election Portal</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 lg:py-6 px-3 overflow-y-auto pt-20 lg:pt-6 space-y-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${
                isInElectionsGroup
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="flex-1 text-left">Elections</span>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isInElectionsGroup ? 'rotate-90' : ''
                }`}
              />
            </button>

            {isInElectionsGroup && (
              <div className="ml-4 pl-4 border-l border-gray-200 space-y-1">
                {tabItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.key
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {typeof item.count === 'number' && (
                      <span
                        className={`text-xs font-medium ${
                          activeTab === item.key ? 'text-purple-600' : 'text-gray-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/officer/reports')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm text-gray-600 hover:bg-gray-50 font-medium"
            >
              <FileText className="w-5 h-5" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => navigate('/officer/election/create')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm text-gray-600 hover:bg-gray-50 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Election</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm text-gray-600 hover:bg-gray-50 font-medium">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500">Election Officer</p>
              </div>
              <button
                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        {/* Page header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {tabTitle[activeTab]}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">{tabSubtitle[activeTab]}</p>
            </div>
            <button
              onClick={() => navigate('/officer/election/create')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Election
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticCard
              icon={<Calendar className="w-6 h-6" />}
              label="Active Elections"
              value={activeElectionsCount}
              color="blue"
            />
            <StatisticCard
              icon={<Users className="w-6 h-6" />}
              label="Total Voters"
              value={totalVoters}
              color="green"
            />
            <StatisticCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              label="Votes Cast"
              value={totalVotesCast}
              color="purple"
            />
            <StatisticCard
              icon={<Clock className="w-6 h-6" />}
              label="Upcoming Elections"
              value={upcomingElectionsCount}
              color="orange"
            />
          </div>

          {/* Section header for current tab */}
          <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'overview' ? 'All Elections' : `${tabTitle[activeTab]}`}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredElections.length} election
                {filteredElections.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Elections Grid */}
          {isLoading ? (
            <div className="bg-white rounded-b-xl border border-gray-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-4">Loading elections...</p>
            </div>
          ) : filteredElections.length === 0 ? (
            <div className="bg-white rounded-b-xl border border-gray-200 p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === 'overview'
                  ? 'No elections created yet. Create your first election to get started.'
                  : `No ${activeTab} elections`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-b-xl border border-gray-200 p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredElections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    onViewDetails={(electionId) => {
                      // Navigate to election management page
                      navigate(`/officer/election/${electionId}/manage`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Turnout Monitor for Active Elections */}
          {activeElectionsCount > 0 && (
            <div className="mt-8">
              <TurnoutMonitor
                elections={elections
                  .filter((e) => e.status === 'active')
                  .map((e) => ({
                    id: e.id,
                    title: e.title,
                    totalVoters: e.total_voters,
                    votesCast: e.total_votes_cast,
                  }))}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
