import { Calendar, Clock, Users, Edit2, Trash2 } from 'lucide-react';
import type { Election } from '../../types';

interface ElectionCardProps {
  election: Election;
  onEdit?: (election: Election) => void;
  onDelete?: (electionId: string) => void;
  onViewDetails?: (electionId: string) => void;
}

export function ElectionCard({
  election,
  onEdit,
  onDelete,
  onViewDetails,
}: ElectionCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      results_published: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const daysUntilEnd = Math.ceil(
    (new Date(election.voting_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(election.status)}`}>
              {election.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-gray-600">{election.academic_year}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(election)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(election.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Voting: {new Date(election.voting_start).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {daysUntilEnd > 0 ? `Ends in ${daysUntilEnd} day${daysUntilEnd > 1 ? 's' : ''}` : 'Ended'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{election.total_voters} registered voters</span>
        </div>
      </div>

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(election.id)}
          className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium rounded-lg transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
}
