import { Trash2, Edit2 } from 'lucide-react';
import type { ElectionPosition } from '../../types';

interface PositionManagementProps {
  positions: ElectionPosition[];
  onAdd: () => void;
  onEdit: (position: ElectionPosition) => void;
  onDelete: (positionId: string) => void;
  isLoading?: boolean;
}

export function PositionManagement({
  positions,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
}: PositionManagementProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Positions</h3>
        <button
          onClick={onAdd}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
        >
          Add Position
        </button>
      </div>

      <div className="space-y-3">
        {positions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No positions created yet</p>
        ) : (
          positions.map((position) => (
            <div
              key={position.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h4 className="font-medium text-gray-900">{position.position_name}</h4>
                <p className="text-sm text-gray-600">{position.number_of_winners} winner(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(position)}
                  disabled={isLoading}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(position.id)}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
