import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface CandidateApprovalListProps {
  candidates: any[];
  onApprove: (candidateId: string) => void;
  onReject: (candidateId: string) => void;
  isLoading?: boolean;
}

export function CandidateApprovalList({
  candidates,
  onApprove,
  onReject,
  isLoading,
}: CandidateApprovalListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Applications</h3>

      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No candidates yet</p>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-4 rounded-lg border ${getStatusColor(candidate.application_status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(candidate.application_status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {candidate.user?.full_name || 'Unknown'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {candidate.position?.position_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(candidate.submission_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-white capitalize">
                  {candidate.application_status}
                </span>
              </div>

              {candidate.manifesto && (
                <p className="text-sm text-gray-700 mb-3 italic">{candidate.manifesto}</p>
              )}

              {candidate.rejection_reason && (
                <div className="text-sm text-red-700 mb-3 bg-red-50 p-2 rounded">
                  Reason: {candidate.rejection_reason}
                </div>
              )}

              {candidate.application_status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(candidate.id)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(candidate.id)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
