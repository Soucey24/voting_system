import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, StopCircle, Eye, AlertCircle, Clock, Users, UserCheck, DollarSign, BarChart3, FileText, Target } from 'lucide-react';

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
        return 'Election has ended and no more votes can be cast';
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

    setElection((prev) => ({
      ...prev,
      status: newStatus,
    }));

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
    description: string;
  }> = [
    {
      id: 'publish',
      label: 'Publish',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      condition: election.status === 'draft',
      description: 'Make election visible to students',
    },
    {
      id: 'pause',
      label: 'Pause Voting',
      icon: <Pause className="w-5 h-5" />,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      condition: election.status === 'active',
      description: 'Temporarily stop voting',
    },
    {
      id: 'resume',
      label: 'Resume Voting',
      icon: <Play className="w-5 h-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      condition: election.status === 'paused',
      description: 'Resume voting after pause',
    },
    {
      id: 'close',
      label: 'Close Election',
      icon: <StopCircle className="w-5 h-5" />,
      color: 'bg-red-600 hover:bg-red-700',
      condition: election.status === 'active' || election.status === 'paused',
      description: 'End election and prevent further voting',
    },
  ];

  const activeActions = availableActions.filter((a) => a.condition);

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
          <h1 className="text-3xl font-bold text-gray-900">Election Management</h1>
          <p className="text-gray-600 mt-1">Control election lifecycle and status</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Link
            to={`/officer/election/${electionId}/positions`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <Target className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Positions</span>
          </Link>
          <Link
            to={`/officer/election/${electionId}/candidates`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <UserCheck className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Candidates</span>
          </Link>
          <Link
            to={`/officer/election/${electionId}/payments`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <DollarSign className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Payments</span>
          </Link>
          <Link
            to={`/officer/election/${electionId}/students`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Students</span>
          </Link>
          <Link
            to={`/officer/election/${electionId}/turnout`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Turnout</span>
          </Link>
          <Link
            to={`/officer/election/${electionId}/results`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition-all"
          >
            <FileText className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Results</span>
          </Link>
        </div>

        {/* Election Information */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{election.title}</h2>
              <p className="text-gray-600">{election.academic_year} • {election.category}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full font-bold text-lg ${getStatusColor(election.status)}`}>
                {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{getStatusMessage(election.status)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Voting Start</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(election.voting_start).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Voting End</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(election.voting_end).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Time Remaining</p>
              <p className="text-lg font-medium text-gray-900">
                {Math.ceil((new Date(election.voting_end).getTime() - Date.now()) / (1000 * 60 * 60))} hours
              </p>
            </div>
          </div>
        </div>

        {/* Election Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Voters</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{election.total_voters.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Votes Cast</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{election.total_votes_cast.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Candidates</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{election.candidates_count}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Positions</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{election.positions_count}</p>
          </div>
        </div>

        {/* Available Actions */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Actions</h3>

          {activeActions.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <p className="text-yellow-800">
                  No actions available for this election status. The election must be in draft, active, or paused status to perform actions.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {activeActions.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleAction(btn.id)}
                  className={`flex items-center gap-4 w-full px-6 py-4 rounded-lg text-white font-medium transition-colors ${btn.color}`}
                >
                  {btn.icon}
                  <div className="text-left">
                    <p className="font-bold">{btn.label}</p>
                    <p className="text-sm opacity-90">{btn.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Election Control Timeline */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Election Lifecycle</h3>

          <div className="space-y-4">
            {[
              { status: 'draft', label: 'Draft', description: 'Election created and being configured' },
              { status: 'published', label: 'Published', description: 'Election is visible to students' },
              { status: 'active', label: 'Active', description: 'Voting is in progress' },
              { status: 'paused', label: 'Paused', description: 'Voting temporarily stopped' },
              { status: 'closed', label: 'Closed', description: 'Election ended, results ready' },
            ].map((stage) => (
              <div
                key={stage.status}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                  election.status === stage.status
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    election.status === stage.status
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {election.status === stage.status ? '✓' : stage.label[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{stage.label}</p>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                </div>
                {election.status === stage.status && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Current</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && action && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
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
                {action === 'close' && 'Close this election? This action cannot be undone and no more votes will be accepted.'}
              </p>

              {action === 'close' && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                  <p className="text-sm text-red-800">
                    <span className="font-bold">Warning:</span> Closing the election cannot be reversed. Make sure voting period has ended.
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
