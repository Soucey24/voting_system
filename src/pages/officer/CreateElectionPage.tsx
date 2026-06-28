import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Calendar, AlertCircle, Loader, CheckCircle2 } from 'lucide-react';
import { createElection } from '../../services/election';
import { useAuth } from '../../contexts/AuthContext';

// Mock mode - set to true to use mock data
const MOCK_MODE = true;

export function CreateElectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user?.id) {
    return <Navigate to="/officer/dashboard" />;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saveMode, setSaveMode] = useState<'draft' | 'publish'>('draft');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    academic_year: new Date().getFullYear().toString(),
    category: 'university' as const,
    nomination_start: '',
    nomination_end: '',
    voting_start: '',
    voting_end: '',
    slot_application_fee: '0',
    enable_payment: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Election title is required');
      }
      if (!formData.voting_start || !formData.voting_end) {
        throw new Error('Voting start and end dates are required');
      }
      if (new Date(formData.voting_start) >= new Date(formData.voting_end)) {
        throw new Error('Voting start date must be before voting end date');
      }
      if (formData.nomination_start && formData.nomination_end) {
        if (new Date(formData.nomination_start) >= new Date(formData.nomination_end)) {
          throw new Error('Nomination start date must be before nomination end date');
        }
      }

      // Mock mode - create mock data
      if (MOCK_MODE) {
        const mockElection = {
          id: crypto.randomUUID(),
          officer_id: user.id,
          title: formData.title,
          description: formData.description || undefined,
          academic_year: formData.academic_year,
          category: formData.category,
          status: saveMode === 'draft' ? 'draft' : 'published',
          nomination_start: formData.nomination_start || undefined,
          nomination_end: formData.nomination_end || undefined,
          voting_start: formData.voting_start,
          voting_end: formData.voting_end,
          slot_application_fee: parseFloat(formData.slot_application_fee),
          enable_payment: formData.enable_payment,
          total_voters: 0,
          total_votes_cast: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Store in localStorage for demo
        const existingElections = JSON.parse(localStorage.getItem('mock_elections') || '[]');
        existingElections.push(mockElection);
        localStorage.setItem('mock_elections', JSON.stringify(existingElections));

        setSuccess(`✅ Election "${formData.title}" created successfully as ${saveMode}!`);
        
        // Redirect after success message
        setTimeout(() => {
          navigate('/officer/dashboard');
        }, 2000);
      } else {
        // Real mode - use actual service
        await createElection({
          officer_id: user.id,
          title: formData.title,
          description: formData.description || undefined,
          academic_year: formData.academic_year,
          category: formData.category,
          status: saveMode === 'draft' ? 'draft' : 'published',
          nomination_start: formData.nomination_start || undefined,
          nomination_end: formData.nomination_end || undefined,
          voting_start: formData.voting_start,
          voting_end: formData.voting_end,
          slot_application_fee: parseFloat(formData.slot_application_fee),
          enable_payment: formData.enable_payment,
          total_voters: 0,
          total_votes_cast: 0,
        });

        navigate('/officer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create election');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Election Slot</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Election Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Student Representative Council Elections 2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description of the election"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                placeholder="2024/2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="university">University</option>
                <option value="faculty">Faculty</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nomination Period */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Nomination Period (Optional)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomination Start
              </label>
              <input
                type="datetime-local"
                name="nomination_start"
                value={formData.nomination_start}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomination End
              </label>
              <input
                type="datetime-local"
                name="nomination_end"
                value={formData.nomination_end}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Voting Period */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Voting Period *
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="voting_start"
                value={formData.voting_start}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="voting_end"
                value={formData.voting_end}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Payment Configuration</h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enable_payment"
              name="enable_payment"
              checked={formData.enable_payment}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded"
            />
            <label htmlFor="enable_payment" className="text-sm text-gray-700">
              Enable slot application fee payment
            </label>
          </div>

          {formData.enable_payment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Application Fee ($)
              </label>
              <input
                type="number"
                name="slot_application_fee"
                value={formData.slot_application_fee}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/officer/dashboard')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setSaveMode('draft')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            Save as Draft
          </button>

          <button
            type="submit"
            onClick={() => setSaveMode('publish')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            Publish Election
          </button>
        </div>
      </form>
    </div>
  );
}
