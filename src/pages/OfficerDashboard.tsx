import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Bell, LogOut, Calendar, Users, CheckCircle2, Clock, BarChart3, Plus, Settings } from 'lucide-react';
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
  const completedElectionsCount = elections.filter((e) => ['closed', 'results_published'].includes(e.status)).length;
  const totalVoters = elections.reduce((sum, e) => sum + e.total_voters, 0);
  const totalVotesCast = elections.reduce((sum, e) => sum + e.total_votes_cast, 0);

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage elections under your assigned scope</p>
          </div>
          <button
            onClick={() => navigate('/officer/election/create')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Election
          </button>
        </div>

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

        {/* Tabs */}
        <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 p-4 flex gap-4">
          {(['overview', 'active', 'upcoming', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'overview' && elections.length > 0 && (
                <span className="ml-2 text-sm">({elections.length})</span>
              )}
              {tab === 'active' && (
                <span className="ml-2 text-sm">({activeElectionsCount})</span>
              )}
              {tab === 'upcoming' && (
                <span className="ml-2 text-sm">({upcomingElectionsCount})</span>
              )}
              {tab === 'completed' && (
                <span className="ml-2 text-sm">({completedElectionsCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Elections Grid */}
        {isLoading ? (
          <div className="bg-white rounded-b-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-4">Loading elections...</p>
          </div>
        ) : filteredElections.length === 0 ? (
          <div className="bg-white rounded-b-lg border border-gray-200 p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {activeTab === 'overview'
                ? 'No elections created yet. Create your first election to get started.'
                : `No ${activeTab} elections`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-b-lg border border-gray-200 p-6">
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
      </main>
    </div>
  );
}
