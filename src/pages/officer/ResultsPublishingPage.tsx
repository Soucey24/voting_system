import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, Download, Loader, Award } from 'lucide-react';
import { getElectionResults, publishResults, closeElection, getElectionById } from '../../services/election';

interface ResultsPublishingPageProps {
  onBack?: () => void;
}

interface VoteResult {
  id: string;
  candidate: {
    user?: {
      full_name: string;
    };
    position?: {
      position_name: string;
    };
  };
  position_id: string;
}

export function ResultsPublishingPage({ onBack }: ResultsPublishingPageProps) {
  const { electionId } = useParams<{ electionId: string }>();

  if (!electionId) {
    return <Navigate to="/officer/dashboard" />;
  }
  const [election, setElection] = useState<any>(null);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultsPublished, setResultsPublished] = useState(false);

  // Load results on mount
  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const [electionData, resultsData] = await Promise.all([
        getElectionById(electionId),
        getElectionResults(electionId),
      ]);

      setElection(electionData);
      setResults(resultsData || []);
      setResultsPublished(electionData.status === 'results_published');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseElection = async () => {
    if (
      !confirm(
        'Are you sure you want to close this election? This action cannot be undone. You will be able to publish results after closing.'
      )
    ) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await closeElection(electionId);
      await loadResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close election');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishResults = async () => {
    if (!confirm('Are you sure you want to publish these results? This will make them visible to all students.')) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await publishResults(electionId);
      await loadResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = () => {
    try {
      // Count votes per candidate per position
      const voteCount: Record<string, Record<string, number>> = {};

      results.forEach((result) => {
        const positionName = result.candidate.position?.position_name || 'Unknown';
        const candidateName = result.candidate.user?.full_name || 'Unknown';

        if (!voteCount[positionName]) {
          voteCount[positionName] = {};
        }

        if (!voteCount[positionName][candidateName]) {
          voteCount[positionName][candidateName] = 0;
        }

        voteCount[positionName][candidateName]++;
      });

      // Generate CSV
      let csvContent = 'Position,Candidate,Votes\n';
      Object.entries(voteCount).forEach(([position, candidates]) => {
        Object.entries(candidates).forEach(([candidate, count]) => {
          csvContent += `"${position}","${candidate}",${count}\n`;
        });
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `election-results-${Date.now()}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export results');
    }
  };

  if (!election) {
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
          <h1 className="text-2xl font-bold text-gray-900">Results Publishing</h1>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Group results by position and count votes
  const resultsByPosition: Record<string, Map<string, number>> = {};
  results.forEach((result) => {
    const positionName = result.candidate.position?.position_name || 'Unknown';
    const candidateName = result.candidate.user?.full_name || 'Unknown';

    if (!resultsByPosition[positionName]) {
      resultsByPosition[positionName] = new Map();
    }

    const currentCount = resultsByPosition[positionName].get(candidateName) || 0;
    resultsByPosition[positionName].set(candidateName, currentCount + 1);
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Election Results</h1>
        <button
          onClick={handleExportResults}
          disabled={isLoading || results.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Election Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Election Status</p>
            <p className="text-lg font-semibold text-gray-900">{election.status.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Votes</p>
            <p className="text-2xl font-bold text-purple-600">{results.length}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {election.status === 'active' && (
        <button
          onClick={handleCloseElection}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          Close Election
        </button>
      )}

      {election.status === 'closed' && (
        <button
          onClick={handlePublishResults}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          Publish Results
        </button>
      )}

      {resultsPublished && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">✓ Results are now published and visible to all students</p>
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No votes have been cast yet</p>
        </div>
      ) : (
        // Results by Position
        <div className="space-y-6">
          {Object.entries(resultsByPosition).map(([positionName, candidates]) => {
            const sortedCandidates = Array.from(candidates.entries()).sort((a, b) => b[1] - a[1]);
            const totalVotes = Array.from(candidates.values()).reduce((a, b) => a + b, 0);

            return (
              <div key={positionName} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{positionName}</h3>
                </div>

                <div className="space-y-4">
                  {sortedCandidates.map(([candidateName, votes], index) => {
                    const percentage = Math.round((votes / totalVotes) * 100);
                    const isWinner = index < 1; // Assuming 1 winner per position

                    return (
                      <div key={candidateName} className={`${isWinner ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''} p-4 rounded-lg`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isWinner && <Award className="w-5 h-5 text-yellow-600" />}
                            <h4 className="font-medium text-gray-900">{candidateName}</h4>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {votes} vote{votes !== 1 ? 's' : ''} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
