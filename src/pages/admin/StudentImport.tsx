import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  FileText,
  Users,
  Trash2,
} from 'lucide-react';
import { supabase } from '../../services/supabase';

interface ImportedStudent {
  student_id: string;
  full_name: string;
  email: string;
  faculty: string;
  department: string;
  status: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface StudentImportProps {
  onImport: () => void;
}

export function StudentImport({ onImport }: StudentImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<ImportedStudent[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('Please upload a CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
    setError('');

    if (selectedFile.name.endsWith('.csv')) {
      parseCSV(selectedFile);
    }
  }

  async function parseCSV(file: File) {
    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const students: ImportedStudent[] = [];
    for (let i = 1; i < lines.length && i < 11; i++) {
      const values = lines[i].split(',');
      students.push({
        student_id: values[headers.indexOf('student_id')]?.trim() || '',
        full_name: values[headers.indexOf('full_name')]?.trim() || '',
        email: values[headers.indexOf('email')]?.trim() || '',
        faculty: values[headers.indexOf('faculty')]?.trim() || '',
        department: values[headers.indexOf('department')]?.trim() || '',
        status: values[headers.indexOf('status')]?.trim() || 'active',
      });
    }
    setPreview(students);
  }

  async function handleUpload() {
    if (!file) return;

    setIsUploading(true);
    setError('');
    setImportResult(null);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const students: ImportedStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 3) continue;

        students.push({
          student_id: values[headers.indexOf('student_id')]?.trim() || '',
          full_name: values[headers.indexOf('full_name')]?.trim() || '',
          email: values[headers.indexOf('email')]?.trim() || '',
          faculty: values[headers.indexOf('faculty')]?.trim() || '',
          department: values[headers.indexOf('department')]?.trim() || '',
          status: values[headers.indexOf('status')]?.trim() || 'active',
        });
      }

      const { data: faculties } = await supabase.from('faculties').select('id, name, code');
      const { data: departments } = await supabase.from('departments').select('id, name, code, faculty_id');

      const facultyMap = new Map(faculties?.map((f) => [f.name.toLowerCase(), f.id]) || []);
      const deptMap = new Map(
        departments?.map((d) => [`${d.name.toLowerCase()}_${d.faculty_id}`, d.id]) || []
      );

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const student of students) {
        if (!student.student_id || !student.full_name || !student.email) {
          failedCount++;
          errors.push(`Row skipped: Missing required fields`);
          continue;
        }

        const facultyId = facultyMap.get(student.faculty.toLowerCase());
        let departmentId = null;

        if (facultyId && student.department) {
          departmentId = deptMap.get(`${student.department.toLowerCase()}_${facultyId}`);
        }

        const { error: insertError } = await supabase.from('student_records').upsert(
          {
            student_id: student.student_id,
            full_name: student.full_name,
            email: student.email,
            faculty_id: facultyId,
            department_id: departmentId,
            status: student.status || 'active',
          },
          { onConflict: 'student_id' }
        );

        if (insertError) {
          failedCount++;
          errors.push(`${student.student_id}: ${insertError.message}`);
        } else {
          successCount++;
        }
      }

      setImportResult({ success: successCount, failed: failedCount, errors });
      onImport();
    } catch {
      setError('Failed to process file');
    } finally {
      setIsUploading(false);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview([]);
    setImportResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function downloadTemplate() {
    const template = 'student_id,full_name,email,faculty,department,status\n03212345,John Doe,03212345@university.edu,Engineering,Computer Science,active\n03212346,Jane Smith,03212346@university.edu,Science,Physics,active';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Import</h2>
          <p className="text-gray-600">Import official student records for verification</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Download Template</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">File Format</h3>
            <p className="text-sm text-gray-500">CSV or Excel file with student records</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">Required columns:</p>
          <div className="flex flex-wrap gap-2">
            {['student_id', 'full_name', 'email', 'faculty', 'department', 'status (optional)'].map((col) => (
              <span key={col} className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border">
                {col}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />

          {file ? (
            <div className="flex items-center justify-center gap-4">
              <FileText className="w-10 h-10 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">CSV or Excel (max 10MB)</p>
            </label>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Import Students</span>
              </>
            )}
          </button>
        </div>
      </div>

      {importResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Import Results</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{importResult.success}</p>
                <p className="text-sm text-green-600">Successfully imported</p>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-700">{importResult.failed}</p>
                <p className="text-sm text-red-600">Failed to import</p>
              </div>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Errors:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {importResult.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {importResult.errors.length > 5 && (
                  <li className="text-gray-400">...and {importResult.errors.length - 5} more errors</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {preview.length > 0 && !importResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Preview (first {preview.length} rows)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Faculty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((student, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{student.student_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{student.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.faculty}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
