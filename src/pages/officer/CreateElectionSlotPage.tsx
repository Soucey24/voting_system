import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ElectionFormData {
  title: string;
  description: string;
  academic_year: string;
  category: 'university' | 'faculty' | 'department';
  nomination_start: string;
  nomination_end: string;
  voting_start: string;
  voting_end: string;
  slot_application_fee: string;
  enable_payment: boolean;
  slot_availability: number; // Number of available slots
}

export function CreateElectionSlotPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveMode, setSaveMode] = useState<'draft' | 'publish'>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ElectionFormData>({
    title: '',
    description: '',
    academic_year: new Date().getFullYear().toString(),
    category: 'university',
    nomination_start: '',
    nomination_end: '',
    voting_start: '',
    voting_end: '',
    slot_application_fee: '0',
    enable_payment: false,
    slot_availability: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? target.checked
          : type === 'number'
            ? parseInt(value)
            : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Election title is required';
    }
    if (!formData.academic_year) {
      newErrors.academic_year = 'Academic year is required';
    }
    if (!formData.voting_start) {
      newErrors.voting_start = 'Voting start date is required';
    }
    if (!formData.voting_end) {
      newErrors.voting_end = 'Voting end date is required';
    }
    if (formData.voting_start && formData.voting_end) {
      if (new Date(formData.voting_start) >= new Date(formData.voting_end)) {
        newErrors.voting_end = 'Voting end must be after voting start';
      }
    }
    if (formData.nomination_start && formData.nomination_end) {
      if (new Date(formData.nomination_start) >= new Date(formData.nomination_end)) {
        newErrors.nomination_end = 'Nomination end must be after nomination start';
      }
    }
    if (formData.enable_payment && parseFloat(formData.slot_application_fee) <= 0) {
      newErrors.slot_application_fee = 'Fee must be greater than 0 when payment is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Connect to backend when ready
      const electionData = {
        officer_id: user?.id,
        ...formData,
        status: saveMode === 'draft' ? 'draft' : 'published',
        slot_application_fee: parseFloat(formData.slot_application_fee),
      };

      console.log('Saving election:', electionData);

      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard
      navigate('/officer/dashboard', {
        state: {
          message: `Election slot "${formData.title}" ${saveMode === 'draft' ? 'saved as draft' : 'published'} successfully!`,
        },
      });
    } catch (error) {
      console.error('Error saving election:', error);
      setErrors({ submit: 'Failed to save election slot' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/officer/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Election Slot</h1>
          <p className="text-gray-600 mt-1">Set up a new election with all necessary details</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.submit && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Student Council Elections 2024"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.academic_year ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.academic_year && (
                  <p className="text-red-500 text-sm mt-1">{errors.academic_year}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="university">University Level</option>
                  <option value="faculty">Faculty Level</option>
                  <option value="department">Department Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Slots
                </label>
                <input
                  type="number"
                  name="slot_availability"
                  value={formData.slot_availability}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Number of available slots"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about this election..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Nomination Period */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Nomination Period (Optional)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomination Start Date
                </label>
                <input
                  type="datetime-local"
                  name="nomination_start"
                  value={formData.nomination_start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomination End Date
                </label>
                <input
                  type="datetime-local"
                  name="nomination_end"
                  value={formData.nomination_end}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.nomination_end ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nomination_end && (
                  <p className="text-red-500 text-sm mt-1">{errors.nomination_end}</p>
                )}
              </div>
            </div>
          </div>

          {/* Voting Period */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Voting Period *
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voting Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="voting_start"
                  value={formData.voting_start}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.voting_start ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.voting_start && (
                  <p className="text-red-500 text-sm mt-1">{errors.voting_start}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voting End Date *
                </label>
                <input
                  type="datetime-local"
                  name="voting_end"
                  value={formData.voting_end}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                    errors.voting_end ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.voting_end && (
                  <p className="text-red-500 text-sm mt-1">{errors.voting_end}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Payment Configuration
            </h2>
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="enable_payment"
                  checked={formData.enable_payment}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 cursor-pointer"
                />
                <span className="text-gray-700 font-medium">Enable Slot Application Fee</span>
              </label>

              {formData.enable_payment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slot Application Fee (₦) *
                  </label>
                  <input
                    type="number"
                    name="slot_application_fee"
                    value={formData.slot_application_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter fee amount"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                      errors.slot_application_fee ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.slot_application_fee && (
                    <p className="text-red-500 text-sm mt-1">{errors.slot_application_fee}</p>
                  )}
                  <p className="text-gray-600 text-sm mt-2">
                    Candidates must pay this fee to confirm their slot. Payment confirmation grants automatic slot access.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setSaveMode('draft')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                saveMode === 'draft'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => setSaveMode('publish')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                saveMode === 'publish'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-5 h-5" />
              Save & Publish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {saveMode === 'draft' ? 'Save Draft' : 'Publish Election'}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
