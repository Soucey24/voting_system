import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, Users, TrendingUp } from 'lucide-react';
import { getElectionStats, getElectionById } from '../../services/election';
import { TurnoutMonitor } from '../../components/officer/TurnoutMonitor';

interface TurnoutMonitoringPageProps {
  onBack?: () => void;
}

export function TurnoutMonitoringPage({ onBack }: TurnoutMonitoringPageProps) {
  const { electionId } = useParams<{ electionId: string }>();
  
  if (!electionId) {
    return <Navigate to="/officer/dashboard" />;
  }
  const [election, setElection] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
    let interval: ReturnType<typeof setInterval> | undefined;

    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [electionData, statsData] = await Promise.all([
        getElectionById(electionId),
        getElectionStats(electionId),
      ]);

      setElection(electionData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!election || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Turnout Monitoring</h1>
        </div>
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const turnoutPercentage = Math.round(stats.turnoutPercentage);
  const remainingVoters = stats.totalVoters - stats.totalVotesCast;
  const timeRemaining = new Date(election.voting_end);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.ceil((timeRemaining.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.ceil(((timeRemaining.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{election.title}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded"
            />
            Auto-refresh every 10s
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Turnout Display */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-purple-600 mb-2">{turnoutPercentage}%</div>
          <p className="text-xl text-gray-600">Overall Turnout</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.totalVotesCast} votes cast out of {stats.totalVoters} registered voters
          </p>
        </div>

        {/* Circular Progress Display */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#a855f7"
                strokeWidth="10"
                strokeDasharray={`${565.48 * (turnoutPercentage / 100)} 565.48`}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">{stats.totalVotesCast}</div>
              <div className="text-sm text-gray-600">votes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Voters</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalVoters}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Votes Cast</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.totalVotesCast}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Remaining</p>
          <p className="text-2xl font-bold text-orange-600">{remainingVoters}</p>
          <p className="text-xs text-gray-500 mt-1">{Math.round((remainingVoters / stats.totalVoters) * 100)}% to vote</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Time Remaining</p>
          <p className="text-2xl font-bold text-red-600">
            {hoursLeft}h {minutesLeft}m
          </p>
          <p className="text-xs text-gray-500 mt-1">Until voting ends</p>
        </div>
      </div>

      {/* Candidate Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Approved Candidates</p>
          <p className="text-2xl font-bold text-green-600">{stats.candidatesApproved}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Rejected Candidates</p>
          <p className="text-2xl font-bold text-red-600">{stats.candidatesRejected}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Payment Status</p>
          <div className="text-sm">
            <p className="font-semibold text-green-600">${stats.successfulPayments}</p>
            <p className="text-gray-500 text-xs">{stats.successfulPayments} successful payments</p>
          </div>
        </div>
      </div>

      {/* Live Turnout Monitor */}
      <TurnoutMonitor
        elections={[
          {
            id: election.id,
            title: election.title,
            totalVoters: stats.totalVoters,
            votesCast: stats.totalVotesCast,
          },
        ]}
      />
    </div>
  );
}
