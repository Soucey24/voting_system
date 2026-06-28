import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Download, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface ElectionResult {
  position: string;
  candidates: Array<{
    name: string;
    votes: number;
    percentage: number;
    isWinner: boolean;
  }>;
}

const MOCK_RESULTS: ElectionResult[] = [
  {
    position: 'President',
    candidates: [
      { name: 'Chioma Okafor', votes: 1200, percentage: 45, isWinner: true },
      { name: 'Adeyemi Adebayo', votes: 980, percentage: 37, isWinner: false },
      { name: 'Grace Nnamdi', votes: 520, percentage: 18, isWinner: false },
    ],
  },
  {
    position: 'Vice President',
    candidates: [
      { name: 'Ibrahim Hassan', votes: 1150, percentage: 43, isWinner: true },
      { name: 'Folake Johnson', votes: 880, percentage: 33, isWinner: false },
      { name: 'David Obi', votes: 670, percentage: 24, isWinner: false },
    ],
  },
  {
    position: 'Secretary',
    candidates: [
      { name: 'Zainab Mohammed', votes: 1400, percentage: 52, isWinner: true },
      { name: 'Peter Adeleke', votes: 800, percentage: 30, isWinner: false },
      { name: 'Linda Eze', votes: 500, percentage: 18, isWinner: false },
    ],
  },
];

export function ResultsPublishingNewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const electionId = params.electionId;

  const [results] = useState<ElectionResult[]>(MOCK_RESULTS);
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [tallying, setTallying] = useState(false);

  const totalVotes = results.reduce((sum, r) => sum + r.candidates.reduce((s, c) => s + c.votes, 0), 0);

  const handleTallyVotes = () => {
    setTallying(true);
    setTimeout(() => {
      setTallying(false);
      alert('Vote tallying complete! Results are ready to publish.');
    }, 2000);
  };

  const handlePublishResults = () => {
    setShowPublishConfirm(false);
    setIsPublished(true);
  };

  const handleExportResults = () => {
    const headers = ['Position', 'Candidate Name', 'Votes', 'Percentage', 'Winner'];
    const rows: string[][] = [];

    results.forEach((result) => {
      result.candidates.forEach((candidate) => {
        rows.push([
          result.position,
          candidate.name,
          candidate.votes.toString(),
          `${candidate.percentage}%`,
          candidate.isWinner ? 'YES' : 'NO',
        ]);
      });
    });

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${electionId || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Publish Election Results</h1>
              <p className="text-gray-600 mt-1">Vote tallying and official results publication</p>
            </div>
            {isPublished && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Results Published
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPublished && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">Before Publishing</h3>
            </div>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Ensure voting period has ended</li>
              <li>• Verify all votes have been counted</li>
              <li>• Review results for accuracy</li>
              <li>• Results cannot be modified after publication</li>
            </ul>
          </div>
        )}

        {/* Vote Tally Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vote Summary</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded p-4">
              <p className="text-gray-600 text-sm">Total Positions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{results.length}</p>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-gray-600 text-sm">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{results.reduce((sum, r) => sum + r.candidates.length, 0)}</p>
            </div>
            <div className="bg-purple-50 rounded p-4">
              <p className="text-gray-600 text-sm">Total Votes Cast</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">{totalVotes.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded p-4">
              <p className="text-gray-600 text-sm">Winners Determined</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{results.filter((r) => r.candidates.some((c) => c.isWinner)).length}</p>
            </div>
          </div>
        </div>

        {/* Results by Position */}
        <div className="space-y-6 mb-8">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">{result.position}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {result.candidates.map((candidate, cidx) => (
                    <div
                      key={cidx}
                      className={`p-4 rounded-lg border-2 ${
                        candidate.isWinner
                          ? 'border-yellow-300 bg-yellow-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {candidate.isWinner && (
                            <Trophy className="w-6 h-6 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-bold text-gray-900">{candidate.name}</p>
                            {candidate.isWinner && (
                              <p className="text-sm text-yellow-700">Winner</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{candidate.votes}</p>
                          <p className="text-sm text-gray-600 font-medium">{candidate.percentage}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            candidate.isWinner
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                              : 'bg-gradient-to-r from-purple-400 to-purple-500'
                          }`}
                          style={{ width: `${candidate.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {!isPublished && (
            <>
              <button
                onClick={handleTallyVotes}
                disabled={tallying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {tallying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Tallying Votes...
                  </>
                ) : (
                  'Tally Votes'
                )}
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Publish Results
              </button>
            </>
          )}
          <button
            onClick={handleExportResults}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export as CSV
          </button>
        </div>

        {isPublished && (
          <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-900">Results Are Published</h3>
            </div>
            <p className="text-green-800 mb-4">
              Official election results are now published and visible to all students. Results cannot be modified.
            </p>
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Results Publication</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to publish these results? This action cannot be undone and results will become visible to all students immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishResults}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Publish Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
