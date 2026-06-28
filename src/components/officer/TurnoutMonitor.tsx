interface TurnoutMonitorProps {
  elections: Array<{
    id: string;
    title: string;
    totalVoters: number;
    votesCast: number;
  }>;
}

export function TurnoutMonitor({ elections }: TurnoutMonitorProps) {
  const getTurnoutPercentage = (votesCast: number, totalVoters: number) => {
    return totalVoters > 0 ? Math.round((votesCast / totalVoters) * 100) : 0;
  };

  const getTurnoutColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Voter Turnout</h3>

      <div className="space-y-6">
        {elections.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No elections to display</p>
        ) : (
          elections.map((election) => {
            const percentage = getTurnoutPercentage(election.votesCast, election.totalVoters);

            return (
              <div key={election.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{election.title}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {percentage}%
                    <span className="text-gray-500 font-normal ml-1">
                      ({election.votesCast}/{election.totalVoters})
                    </span>
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getTurnoutColor(percentage)} rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
