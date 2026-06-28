import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';
import {
  getPendingCandidates,
  approveCandidateCandidate,
  rejectCandidate,
  publishCandidatesForVoting,
} from '../../services/election';
import { CandidateApprovalList } from '../../components/officer/CandidateApprovalList';
import { useAuth } from '../../contexts/AuthContext';

interface CandidateApprovalPageProps {
  onBack?: () => void;
}

export function CandidateApprovalPage({ onBack }: CandidateApprovalPageProps) {
  const { electionId } = useParams<{ electionId: string }>();
  
  if (!electionId) {
    return <Navigate to="/officer/dashboard" />;
  }
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);

  // Load pending candidates on mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await getPendingCandidates(electionId);
      setCandidates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (candidateId: string) => {
    try {
      setError('');
      if (!user?.id) throw new Error('User not authenticated');

      setIsLoading(true);
      await approveCandidateCandidate(candidateId, user.id);
      await loadCandidates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (candidateId: string) => {
    try {
      setError('');
      if (!rejectionReason.trim()) {
        setError('Rejection reason is required');
        return;
      }

      setIsLoading(true);
      await rejectCandidate(candidateId, rejectionReason);
      setShowRejectForm(null);
      setRejectionReason('');
      await loadCandidates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishApprovedCandidates = async () => {
    try {
      setError('');
      const approvedCandidateIds = candidates
        .filter((c) => c.application_status === 'approved')
        .map((c) => c.id);

      if (approvedCandidateIds.length === 0) {
        setError('No approved candidates to publish');
        return;
      }

      setIsLoading(true);
      await publishCandidatesForVoting(approvedCandidateIds);
      await loadCandidates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const approvedCount = candidates.filter((c) => c.application_status === 'approved').length;
  const rejectedCount = candidates.filter((c) => c.application_status === 'rejected').length;
  const pendingCount = candidates.filter((c) => c.application_status === 'pending').length;

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
        <h1 className="text-2xl font-bold text-gray-900">Candidate Approval</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-sm text-gray-600">Approved</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </div>
      </div>

      {/* Publish Approved Candidates Button */}
      {approvedCount > 0 && (
        <button
          onClick={handlePublishApprovedCandidates}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          Publish {approvedCount} Approved Candidate{approvedCount !== 1 ? 's' : ''} for Voting
        </button>
      )}

      {/* Rejection Form */}
      {showRejectForm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Provide Rejection Reason</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this candidate application is being rejected"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRejectForm(null);
                setRejectionReason('');
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleReject(showRejectForm)}
              disabled={isLoading || !rejectionReason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      <CandidateApprovalList
        candidates={candidates}
        onApprove={handleApprove}
        onReject={(candidateId) => {
          setShowRejectForm(candidateId);
          setRejectionReason('');
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
