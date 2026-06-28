import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle, AlertCircle, XCircle, Download, Filter, Search } from 'lucide-react';

interface Payment {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  position: string;
  amount: number;
  status: 'pending' | 'successful' | 'failed';
  transactionId: string;
  paymentDate: string;
  verificationDate?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    candidateId: 'cand-1',
    candidateName: 'John Doe',
    email: 'john@university.edu',
    position: 'President',
    amount: 500,
    status: 'successful',
    transactionId: 'TXN-2024-001',
    paymentDate: '2024-06-20T10:30:00',
    verificationDate: '2024-06-20T10:35:00',
  },
  {
    id: '2',
    candidateId: 'cand-2',
    candidateName: 'Jane Smith',
    email: 'jane@university.edu',
    position: 'Vice President',
    amount: 500,
    status: 'successful',
    transactionId: 'TXN-2024-002',
    paymentDate: '2024-06-20T11:15:00',
    verificationDate: '2024-06-20T11:20:00',
  },
  {
    id: '3',
    candidateId: 'cand-3',
    candidateName: 'Mike Johnson',
    email: 'mike@university.edu',
    position: 'Secretary',
    amount: 500,
    status: 'pending',
    transactionId: 'TXN-2024-003',
    paymentDate: '2024-06-20T14:00:00',
  },
  {
    id: '4',
    candidateId: 'cand-4',
    candidateName: 'Sarah Williams',
    email: 'sarah@university.edu',
    position: 'Treasurer',
    amount: 500,
    status: 'failed',
    transactionId: 'TXN-2024-004',
    paymentDate: '2024-06-20T15:45:00',
  },
];

export function PaymentManagementPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'successful' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = payments
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)
    .filter(
      (p) =>
        p.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: payments.length,
    successful: payments.filter((p) => p.status === 'successful').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    totalAmount: payments
      .filter((p) => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const handleVerifyPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowVerificationModal(true);
  };

  const confirmVerification = () => {
    if (selectedPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: 'successful',
                verificationDate: new Date().toISOString(),
              }
            : p
        )
      );
      setShowVerificationModal(false);
      setSelectedPayment(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Candidate Name', 'Email', 'Position', 'Amount', 'Status', 'Transaction ID', 'Payment Date'];
    const rows = filteredPayments.map((p) => [
      p.candidateName,
      p.email,
      p.position,
      p.amount,
      p.status,
      p.transactionId,
      new Date(p.paymentDate).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${electionId || 'export'}.csv`;
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Track and verify candidate slot application payments</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Payments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Successful</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.successful}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">Failed</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.failed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">₦{stats.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.candidateName}</p>
                        <p className="text-sm text-gray-600">{payment.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{payment.position}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-sm">{payment.transactionId}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === 'successful'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status === 'successful' && <CheckCircle className="w-4 h-4" />}
                        {payment.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                        {payment.status === 'failed' && <XCircle className="w-4 h-4" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => handleVerifyPayment(payment)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Verify
                        </button>
                      )}
                      {payment.status === 'successful' && (
                        <span className="text-green-600 text-sm">✓ Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No payments found</p>
            </div>
          )}
        </div>
      </main>

      {/* Verification Modal */}
      {showVerificationModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Verify Payment</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Candidate:</span> {selectedPayment.candidateName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Amount:</span> ₦{selectedPayment.amount.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Transaction ID:</span> {selectedPayment.transactionId}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Current Status:</span> {selectedPayment.status}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Confirming this payment will mark it as successful and grant the candidate automatic slot access.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVerification}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Confirm & Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
