import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Eye, AlertCircle, Filter } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  position: string;
  faculty: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Chioma Okafor',
    email: 'chioma@university.edu',
    matricNumber: 'ENG/2021/001',
    position: 'President',
    faculty: 'Engineering',
    applicationDate: '2024-06-15',
    status: 'pending',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    name: 'Adeyemi Adebayo',
    email: 'adeyemi@university.edu',
    matricNumber: 'SCI/2021/045',
    position: 'Vice President',
    faculty: 'Science',
    applicationDate: '2024-06-16',
    status: 'pending',
    paymentStatus: 'paid',
  },
  {
    id: '3',
    name: 'Grace Nnamdi',
    email: 'grace@university.edu',
    matricNumber: 'LAW/2021/023',
    position: 'Secretary',
    faculty: 'Law',
    applicationDate: '2024-06-14',
    status: 'approved',
    paymentStatus: 'paid',
  },
  {
    id: '4',
    name: 'Ibrahim Hassan',
    email: 'ibrahim@university.edu',
    matricNumber: 'MED/2021/067',
    position: 'Treasurer',
    faculty: 'Medicine',
    applicationDate: '2024-06-17',
    status: 'rejected',
    paymentStatus: 'paid',
    rejectionReason: 'Incomplete documentation',
  },
];

export function CandidateApprovalNewPage() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredCandidates = candidates.filter(
    (c) => filterStatus === 'all' || c.status === filterStatus
  );

  const stats = {
    total: candidates.length,
    pending: candidates.filter((c) => c.status === 'pending').length,
    approved: candidates.filter((c) => c.status === 'approved').length,
    rejected: candidates.filter((c) => c.status === 'rejected').length,
  };

  const handleApproveCandidate = (candidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id
          ? { ...c, status: 'approved' }
          : c
      )
    );
  };

  const handleRejectCandidate = () => {
    if (selectedCandidate && rejectionReason.trim()) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === selectedCandidate.id
            ? { ...c, status: 'rejected', rejectionReason }
            : c
        )
      );
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedCandidate(null);
    }
  };

  const handleShowDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowDetailsModal(true);
  };

  const handlePublishApprovedCandidates = () => {
    const approvedCount = candidates.filter((c) => c.status === 'approved').length;
    if (approvedCount > 0) {
      alert(`Publishing ${approvedCount} approved candidate(s) for voting!`);
      // TODO: Call backend to publish
    } else {
      alert('No approved candidates to publish');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Candidate Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve candidates for voting</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {stats.approved > 0 && (
            <button
              onClick={handlePublishApprovedCandidates}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Publish {stats.approved} Approved Candidate(s)
            </button>
          )}
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No candidates found with the selected filter</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  candidate.status === 'approved'
                    ? 'border-green-500'
                    : candidate.status === 'rejected'
                      ? 'border-red-500'
                      : 'border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm">{candidate.email}</p>
                    <div className="grid md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Matric:</span>
                        <p className="font-medium">{candidate.matricNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Position:</span>
                        <p className="font-medium">{candidate.position}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Faculty:</span>
                        <p className="font-medium">{candidate.faculty}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Applied:</span>
                        <p className="font-medium">{new Date(candidate.applicationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        candidate.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : candidate.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        candidate.paymentStatus === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {candidate.paymentStatus === 'paid' ? 'Paid' : 'Not Paid'}
                    </span>
                  </div>
                </div>

                {candidate.rejectionReason && candidate.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Rejection Reason:</span> {candidate.rejectionReason}
                    </p>
                  </div>
                )}

                {candidate.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleShowDetails(candidate)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleApproveCandidate(candidate)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {candidate.status === 'approved' && (
                  <p className="text-green-600 text-sm font-medium">✓ Visible for voting</p>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Candidate</h3>
              <p className="text-gray-700 mb-4">
                Are you sure you want to reject <span className="font-medium">{selectedCandidate.name}</span>?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedCandidate(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectCandidate}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Reject Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Candidate Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-medium">{selectedCandidate.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selectedCandidate.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Matric Number</p>
                  <p className="font-medium">{selectedCandidate.matricNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Position Applied</p>
                  <p className="font-medium">{selectedCandidate.position}</p>
                </div>
                <div>
                  <p className="text-gray-600">Faculty</p>
                  <p className="font-medium">{selectedCandidate.faculty}</p>
                </div>
                <div>
                  <p className="text-gray-600">Application Date</p>
                  <p className="font-medium">{new Date(selectedCandidate.applicationDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Status</p>
                  <p className="font-medium">{selectedCandidate.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
