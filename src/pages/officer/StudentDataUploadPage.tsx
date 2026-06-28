import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { addStudentVoters, parseStudentCSV } from '../../services/election';

interface StudentRecord {
  student_id: string;
  full_name: string;
  email: string;
  faculty_id?: string;
  department_id?: string;
}

export function StudentDataUploadPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [parsedRecords, setParsedRecords] = useState<StudentRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!electionId) {
    return <Navigate to="/officer/dashboard" />;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      setSuccess('');
      setShowPreview(false);

      const content = await file.text();

      // Parse CSV
      const records = await parseStudentCSV(content);

      if (records.length === 0) {
        setError('No valid records found in CSV');
        return;
      }

      setParsedRecords(records as StudentRecord[]);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    }
  };

  const handleUpload = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Get student record IDs (you'll need to query the database for this)
      // For now, we'll just use the student_id field
      const studentIds = parsedRecords.map((r) => r.student_id);

      await addStudentVoters(electionId, studentIds);

      setSuccess(`Successfully added ${parsedRecords.length} student voters`);
      setParsedRecords([]);
      setShowPreview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload students');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'student_id,full_name,email,faculty_id,department_id\nS001,John Doe,john@example.com,F001,D001\nS002,Jane Smith,jane@example.com,F002,D002';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Student Voters</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold text-gray-900 mb-3">How to upload student records:</h2>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          <li>Download the CSV template below</li>
          <li>Fill in student information (student_id, full_name, email are required)</li>
          <li>Save the file as CSV</li>
          <li>Upload the file using the form below</li>
          <li>Review the preview and confirm</li>
        </ol>
        <button
          onClick={downloadTemplate}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Download Template
        </button>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer hover:border-purple-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium text-gray-900">Click to upload CSV file</p>
          <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Preview */}
      {showPreview && parsedRecords.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preview - {parsedRecords.length} records found
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Full Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Faculty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parsedRecords.slice(0, 5).map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.student_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.faculty_id || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.department_id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedRecords.length > 5 && (
            <p className="text-sm text-gray-600 mb-6">
              ... and {parsedRecords.length - 5} more record{parsedRecords.length - 5 !== 1 ? 's' : ''}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              Upload {parsedRecords.length} Students
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
