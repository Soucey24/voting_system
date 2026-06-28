import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface StudentRecord {
  matricNumber: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
}

export function StudentDataUploadNewPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'preview' | 'success' | 'error'>('idle');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleDownloadTemplate = () => {
    const headers = ['Matric Number', 'Full Name', 'Email', 'Faculty', 'Department'];
    const sampleData = [
      ['ENG/2021/001', 'John Doe', 'john@university.edu', 'Engineering', 'Software Engineering'],
      ['SCI/2021/045', 'Jane Smith', 'jane@university.edu', 'Science', 'Mathematics'],
    ];

    const csv = [headers, ...sampleData].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus('uploading');
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          throw new Error('CSV file must have at least one header row and one data row');
        }

        const headers = lines[0].toLowerCase().split(',').map((h) => h.trim().replace(/"/g, ''));
        const requiredHeaders = ['matric number', 'full name', 'email', 'faculty', 'department'];

        // Check if all required headers are present
        if (!requiredHeaders.every((h) => headers.includes(h))) {
          throw new Error(`CSV must include headers: ${requiredHeaders.join(', ')}`);
        }

        // Parse data rows
        const parsedStudents: StudentRecord[] = [];
        const seenMatricNumbers = new Set<string>();
        let duplicates = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
          if (values.length < requiredHeaders.length) continue;

          const student: StudentRecord = {
            matricNumber: values[headers.indexOf('matric number')],
            name: values[headers.indexOf('full name')],
            email: values[headers.indexOf('email')],
            faculty: values[headers.indexOf('faculty')],
            department: values[headers.indexOf('department')],
          };

          // Validate email
          if (!student.email.includes('@')) {
            throw new Error(`Invalid email at row ${i + 1}: ${student.email}`);
          }

          // Check for duplicates
          if (seenMatricNumbers.has(student.matricNumber)) {
            duplicates++;
            continue;
          }

          seenMatricNumbers.add(student.matricNumber);
          parsedStudents.push(student);
        }

        setStudents(parsedStudents);
        setValidCount(parsedStudents.length);
        setDuplicateCount(duplicates);
        setUploadStatus('preview');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
        setUploadStatus('error');
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    setUploadStatus('uploading');

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Send students data to backend
      console.log(`Uploading ${students.length} student records to election ${electionId}`);

      setUploadStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setUploadStatus('error');
    }
  };

  const handleReset = () => {
    setUploadStatus('idle');
    setStudents([]);
    setErrorMessage('');
    setDuplicateCount(0);
    setValidCount(0);
    setFileName('');
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
          <h1 className="text-3xl font-bold text-gray-900">Student Data Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage student voter records via CSV</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Status */}
        {uploadStatus === 'success' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-900">Upload Successful!</h3>
            </div>
            <p className="text-green-800 mb-4">
              {validCount} student record(s) have been added to the election voter list.
              {duplicateCount > 0 && ` (${duplicateCount} duplicate(s) were skipped)`}
            </p>
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-900">Upload Error</h3>
            </div>
            <p className="text-red-800 mb-4">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {uploadStatus === 'idle' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3">CSV Upload Instructions</h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Download the CSV template below to ensure proper formatting</li>
                <li>• Include columns: Matric Number, Full Name, Email, Faculty, Department</li>
                <li>• Emails must be in valid format (e.g., student@university.edu)</li>
                <li>• Duplicate matric numbers will be automatically skipped</li>
                <li>• All fields are required</li>
              </ul>
            </div>

            {/* Download Template */}
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download CSV Template
            </button>

            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow p-8">
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="font-medium text-gray-600">Drop CSV file here or click to browse</span>
                  <span className="text-sm text-gray-500">Accepted format: CSV</span>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Loader className="w-8 h-8 text-purple-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">Processing file...</p>
          </div>
        )}

        {uploadStatus === 'preview' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">File Name</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{fileName}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Valid Records</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{validCount}</p>
              </div>
              {duplicateCount > 0 && (
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <p className="text-gray-600 text-sm">Duplicates Skipped</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">{duplicateCount}</p>
                </div>
              )}
            </div>

            {/* Preview Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Matric Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Faculty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.slice(0, 10).map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-mono text-sm">{student.matricNumber}</td>
                        <td className="px-6 py-4 text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{student.email}</td>
                        <td className="px-6 py-4 text-gray-700">{student.faculty}</td>
                        <td className="px-6 py-4 text-gray-700">{student.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {students.length > 10 && (
                <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600 border-t border-gray-200">
                  Showing 10 of {students.length} records
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmUpload}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm & Upload
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel & Upload Another File
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
