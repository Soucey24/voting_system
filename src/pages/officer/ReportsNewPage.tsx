import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, DollarSign, Users, FileText, Printer } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'election' | 'payment' | 'turnout';
  description: string;
  icon: React.ReactNode;
  generated: boolean;
  generatedDate?: string;
}

export function ReportsNewPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Election Results Report',
      type: 'election',
      description: 'Complete vote tally and winner announcement with detailed breakdown by position',
      icon: <BarChart3 className="w-8 h-8" />,
      generated: true,
      generatedDate: '2024-06-27T14:30:00',
    },
    {
      id: '2',
      name: 'Payment Summary Report',
      type: 'payment',
      description: 'Comprehensive payment tracking including successful, pending, and failed transactions',
      icon: <DollarSign className="w-8 h-8" />,
      generated: true,
      generatedDate: '2024-06-27T13:15:00',
    },
    {
      id: '3',
      name: 'Voter Turnout Report',
      type: 'turnout',
      description: 'Detailed participation analytics showing turnout percentage and voting patterns',
      icon: <Users className="w-8 h-8" />,
      generated: true,
      generatedDate: '2024-06-27T12:00:00',
    },
    {
      id: '4',
      name: 'Election Audit Report',
      type: 'election',
      description: 'Complete audit trail of all actions taken during the election process',
      icon: <FileText className="w-8 h-8" />,
      generated: false,
    },
    {
      id: '5',
      name: 'Candidate Performance Report',
      type: 'election',
      description: 'Detailed candidate statistics including vote counts and performance analysis',
      icon: <BarChart3 className="w-8 h-8" />,
      generated: true,
      generatedDate: '2024-06-27T14:00:00',
    },
    {
      id: '6',
      name: 'Student Participation Report',
      type: 'turnout',
      description: 'Faculty-wise and department-wise participation rates and demographic analysis',
      icon: <Users className="w-8 h-8" />,
      generated: false,
    },
  ]);

  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReportId(reportId);

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                generated: true,
                generatedDate: new Date().toISOString(),
              }
            : r
        )
      );
      setGeneratingReportId(null);
    }, 2000);
  };

  const handleExportReport = (report: Report, format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csv = `Report: ${report.name}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a sample report export.\n`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '-')}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else if (format === 'pdf') {
      alert(`Exporting ${report.name} as PDF...`);
    }
  };

  const generatedCount = reports.filter((r) => r.generated).length;

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
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">Generate and export election reports</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              {generatedCount} of {reports.length} Reports Ready
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Header */}
              <div className={`p-6 ${report.type === 'election' ? 'bg-blue-50' : report.type === 'payment' ? 'bg-green-50' : 'bg-purple-50'}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                  report.type === 'election'
                    ? 'bg-blue-100 text-blue-600'
                    : report.type === 'payment'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-purple-100 text-purple-600'
                }`}>
                  {report.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{report.name}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>

              {/* Status and Actions */}
              <div className="p-6 border-t border-gray-200">
                {report.generated ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Generated on:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(report.generatedDate!).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowPreview(true);
                        }}
                        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Preview
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleExportReport(report, 'csv')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          CSV
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'pdf')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          PDF
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">Not yet generated</p>
                    <button
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={generatingReportId === report.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                    >
                      {generatingReportId === report.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Generating...
                        </>
                      ) : (
                        'Generate Now'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Report History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Report Generation History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Report Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Generated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports
                  .filter((r) => r.generated)
                  .map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{report.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-600 font-medium">✓ Yes</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(report.generatedDate!).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Export */}
        <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h3 className="font-bold text-purple-900 mb-4">Batch Export All Reports</h3>
          <div className="flex gap-3">
            <button
              onClick={() => alert('Exporting all reports as ZIP...')}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All as ZIP
            </button>
            <button
              onClick={() => alert('Printing all reports...')}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print All Reports
            </button>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{selectedReport.name} - Preview</h3>
            </div>
            <div className="p-6">
              <div className="text-gray-700 space-y-4">
                <p>
                  <span className="font-medium">Report Name:</span> {selectedReport.name}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {selectedReport.type}
                </p>
                <p>
                  <span className="font-medium">Generated:</span>{' '}
                  {new Date(selectedReport.generatedDate!).toLocaleString()}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-medium mb-2">Sample Data:</p>
                  <p className="text-sm text-gray-600">This is a preview of the report. The actual report will contain comprehensive data and analytics.</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
