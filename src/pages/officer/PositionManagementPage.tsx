import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';
import { createPosition, deletePosition, updatePosition, getElectionPositions } from '../../services/election';
import { PositionManagement as PositionManagementComponent } from '../../components/officer/PositionManagement';
import type { ElectionPosition } from '../../types';

interface PositionManagementPageProps {
  onBack?: () => void;
}

export function PositionManagementPage({ onBack }: PositionManagementPageProps) {
  const { electionId } = useParams<{ electionId: string }>();
  
  if (!electionId) {
    return <Navigate to="/officer/dashboard" />;
  }
  const [positions, setPositions] = useState<ElectionPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<ElectionPosition | null>(null);

  const [formData, setFormData] = useState({
    position_name: '',
    number_of_winners: 1,
    description: '',
  });

  // Load positions on mount
  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setIsLoading(true);
      const data = await getElectionPositions(electionId);
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load positions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPosition = () => {
    setEditingPosition(null);
    setFormData({
      position_name: '',
      number_of_winners: 1,
      description: '',
    });
    setShowForm(true);
  };

  const handleEditPosition = (position: ElectionPosition) => {
    setEditingPosition(position);
    setFormData({
      position_name: position.position_name,
      number_of_winners: position.number_of_winners,
      description: position.description || '',
    });
    setShowForm(true);
  };

  const handleSavePosition = async () => {
    try {
      setError('');
      if (!formData.position_name.trim()) {
        setError('Position name is required');
        return;
      }
      if (formData.number_of_winners < 1) {
        setError('Number of winners must be at least 1');
        return;
      }

      setIsLoading(true);

      if (editingPosition) {
        await updatePosition(editingPosition.id, {
          position_name: formData.position_name,
          number_of_winners: formData.number_of_winners,
          description: formData.description || undefined,
        });
      } else {
        await createPosition({
          election_id: electionId,
          position_name: formData.position_name,
          number_of_winners: formData.number_of_winners,
          description: formData.description || undefined,
          display_order: positions.length,
        });
      }

      setShowForm(false);
      await loadPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save position');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePosition = async (positionId: string) => {
    if (!confirm('Are you sure you want to delete this position?')) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await deletePosition(positionId);
      await loadPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete position');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">Manage Positions</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPosition ? 'Edit Position' : 'Add New Position'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Name *
              </label>
              <input
                type="text"
                value={formData.position_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    position_name: e.target.value,
                  }))
                }
                placeholder="e.g., President, Secretary, Treasurer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Winners *
              </label>
              <input
                type="number"
                value={formData.number_of_winners}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    number_of_winners: parseInt(e.target.value),
                  }))
                }
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePosition}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                Save Position
              </button>
            </div>
          </div>
        </div>
      )}

      <PositionManagementComponent
        positions={positions}
        onAdd={handleAddPosition}
        onEdit={handleEditPosition}
        onDelete={handleDeletePosition}
        isLoading={isLoading}
      />
    </div>
  );
}
