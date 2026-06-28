import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PaymentTransactionListProps {
  payments: any[];
  onVerify?: (paymentId: string) => void;
  isLoading?: boolean;
}

export function PaymentTransactionList({
  payments,
  onVerify,
  isLoading,
}: PaymentTransactionListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No payments
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {payment.candidate?.user?.full_name || 'Unknown'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.candidate?.position?.position_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.payment_status)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                          payment.payment_status
                        )}`}
                      >
                        {payment.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.payment_status === 'pending' && onVerify && (
                      <button
                        onClick={() => onVerify(payment.id)}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
