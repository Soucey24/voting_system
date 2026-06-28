import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';

interface Position {
  id: string;
  name: string;
  numberOfWinners: number;
  displayOrder: number;
  description: string;
}

const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    name: 'President',
    numberOfWinners: 1,
    displayOrder: 1,
    description: 'Head of the student council',
  },
  {
    id: '2',
    name: 'Vice President',
    numberOfWinners: 1,
    displayOrder: 2,
    description: 'Deputy head of the student council',
  },
  {
    id: '3',
    name: 'Secretary',
    numberOfWinners: 1,
    displayOrder: 3,
    description: 'Responsible for records and communication',
  },
];

export function PositionManagementNewPage() {
  const navigate = useNavigate();

  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    numberOfWinners: 1,
    displayOrder: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
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

    if (!formData.name.trim()) {
      newErrors.name = 'Position name is required';
    }
    if (formData.numberOfWinners <= 0) {
      newErrors.numberOfWinners = 'Number of winners must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPosition = () => {
    if (!validateForm()) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      name: formData.name,
      numberOfWinners: formData.numberOfWinners,
      displayOrder: positions.length + 1,
      description: formData.description,
    };

    setPositions([...positions, newPosition]);
    resetForm();
  };

  const handleUpdatePosition = (id: string) => {
    if (!validateForm()) return;

    setPositions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: formData.name,
              numberOfWinners: formData.numberOfWinners,
              description: formData.description,
            }
          : p
      )
    );
    resetForm();
  };

  const handleDeletePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (position: Position) => {
    setFormData({
      name: position.name,
      numberOfWinners: position.numberOfWinners,
      displayOrder: position.displayOrder,
      description: position.description,
    });
    setEditingId(position.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      numberOfWinners: 1,
      displayOrder: 0,
      description: '',
    });
    setEditingId(null);
    setShowAddForm(false);
    setErrors({});
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPositions = [...positions];
    [newPositions[index], newPositions[index - 1]] = [newPositions[index - 1], newPositions[index]];
    setPositions(newPositions);
  };

  const handleMoveDown = (index: number) => {
    if (index === positions.length - 1) return;
    const newPositions = [...positions];
    [newPositions[index], newPositions[index + 1]] = [newPositions[index + 1], newPositions[index]];
    setPositions(newPositions);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Position Management</h1>
              <p className="text-gray-600 mt-1">Create and manage election positions</p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Position
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Position' : 'Add New Position'}
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., President, Secretary"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Winners *
                  </label>
                  <input
                    type="number"
                    name="numberOfWinners"
                    value={formData.numberOfWinners}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                      errors.numberOfWinners ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.numberOfWinners && (
                    <p className="text-red-500 text-sm mt-1">{errors.numberOfWinners}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the responsibilities of this position..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => (editingId ? handleUpdatePosition(editingId) : handleAddPosition())}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Position' : 'Add Position'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Positions List */}
        <div className="bg-white rounded-lg shadow">
          {positions.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No positions created yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Position
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {positions.map((position, index) => (
                <div key={position.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{position.name}</h3>
                      {position.description && (
                        <p className="text-gray-600 text-sm mt-1">{position.description}</p>
                      )}
                      <p className="text-gray-600 text-sm mt-2">
                        Winners: <span className="font-medium">{position.numberOfWinners}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <button
                          onClick={() => handleMoveUp(index)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Move up"
                        >
                          ↑
                        </button>
                      )}
                      {index < positions.length - 1 && (
                        <button
                          onClick={() => handleMoveDown(index)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Move down"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(position)}
                        className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save All Positions */}
        {positions.length > 0 && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Save All Positions
            </button>
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
