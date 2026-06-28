import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';

interface TurnoutData {
  electionTitle: string;
  totalVoters: number;
  votesCount: number;
  turnoutPercentage: number;
  lastUpdated: string;
}

export function TurnoutMonitoringNewPage() {
  const navigate = useNavigate();

  const [turnoutData, setTurnoutData] = useState<TurnoutData>({
    electionTitle: 'Student Council Elections 2024',
    totalVoters: 5000,
    votesCount: 3200,
    turnoutPercentage: 64,
    lastUpdated: new Date().toISOString(),
  });

  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Simulate live updates
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setTurnoutData((prev) => ({
        ...prev,
        votesCount: Math.min(prev.votesCount + Math.floor(Math.random() * 50), prev.totalVoters),
        lastUpdated: new Date().toISOString(),
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleManualRefresh = () => {
    setTurnoutData((prev) => ({
      ...prev,
      votesCount: Math.min(prev.votesCount + Math.floor(Math.random() * 100), prev.totalVoters),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateTurnout = () => {
    setTurnoutData((prev) => ({
      ...prev,
      turnoutPercentage: Math.round((prev.votesCount / prev.totalVoters) * 100),
    }));
  };

  useEffect(() => {
    updateTurnout();
  }, [turnoutData.votesCount]);

  const progressPercentage = (turnoutData.votesCount / turnoutData.totalVoters) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/officer/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Turnout Monitoring</h1>
              <p className="text-gray-600 mt-1">Real-time voter participation tracking</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleManualRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Now
              </button>
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isAutoRefresh}
                  onChange={(e) => setIsAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Auto-refresh</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Voters</p>
                <p className="text-3xl font-bold text-gray-900">{turnoutData.totalVoters.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Votes Cast</p>
                <p className="text-3xl font-bold text-gray-900">{turnoutData.votesCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Turnout Rate</p>
                <p className="text-3xl font-bold text-gray-900">{turnoutData.turnoutPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Voting Progress</h2>

          {/* Circular Progress */}
          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-purple-600">{turnoutData.turnoutPercentage}%</p>
                  <p className="text-gray-600 text-sm mt-2">Turnout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-gray-900">Votes Received</p>
              <p className="text-sm text-gray-600">
                {turnoutData.votesCount.toLocaleString()} of {turnoutData.totalVoters.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            Last updated: {new Date(turnoutData.lastUpdated).toLocaleTimeString()}
            {isAutoRefresh && ' (auto-refreshing every 10 seconds)'}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Voting Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-700">Registered Voters</span>
                <span className="font-medium">{turnoutData.totalVoters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-700">Votes Recorded</span>
                <span className="font-medium text-green-600">{turnoutData.votesCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-700">Pending Voters</span>
                <span className="font-medium text-yellow-600">
                  {(turnoutData.totalVoters - turnoutData.votesCount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Turnout %</span>
                <span className="font-medium text-purple-600">{turnoutData.turnoutPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Participation Rate</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Excellent (90-100%)</span>
                  <span className="text-sm text-gray-600">Not reached</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-green-500 h-full rounded-full ${turnoutData.turnoutPercentage >= 90 ? 'w-full' : 'w-0'}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Good (70-89%)</span>
                  <span className="text-sm text-gray-600">{turnoutData.turnoutPercentage >= 70 && turnoutData.turnoutPercentage < 90 ? `${turnoutData.turnoutPercentage}%` : '-'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-blue-500 h-full rounded-full ${turnoutData.turnoutPercentage >= 70 && turnoutData.turnoutPercentage < 90 ? 'w-full' : 'w-0'}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Fair (50-69%)</span>
                  <span className="text-sm text-gray-600">{turnoutData.turnoutPercentage >= 50 && turnoutData.turnoutPercentage < 70 ? `${turnoutData.turnoutPercentage}%` : '-'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-yellow-500 h-full rounded-full ${turnoutData.turnoutPercentage >= 50 && turnoutData.turnoutPercentage < 70 ? 'w-full' : 'w-0'}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Low (&lt;50%)</span>
                  <span className="text-sm text-gray-600">{turnoutData.turnoutPercentage < 50 ? `${turnoutData.turnoutPercentage}%` : '-'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-red-500 h-full rounded-full ${turnoutData.turnoutPercentage < 50 ? 'w-full' : 'w-0'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
