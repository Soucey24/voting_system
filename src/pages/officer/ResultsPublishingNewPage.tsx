import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Download,
  Lock,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
  Calculator,
  ListChecks,
  Send,
  Clock,
  Users,
  Vote,
  Award,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface CandidateResult {
  name: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

interface ElectionResult {
  position: string;
  candidates: CandidateResult[];
}

interface TallyLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'success' | 'pending' | 'info';
}

const MOCK_RESULTS: ElectionResult[] = [
  {
    position: 'President',
    candidates: [
      { name: 'Chioma Okafor', votes: 1200, percentage: 45, isWinner: true },
      { name: 'Adeyemi Adebayo', votes: 980, percentage: 37, isWinner: false },
      { name: 'Grace Nnamdi', votes: 520, percentage: 18, isWinner: false },
    ],
  },
  {
    position: 'Vice President',
    candidates: [
      { name: 'Ibrahim Hassan', votes: 1150, percentage: 43, isWinner: true },
      { name: 'Folake Johnson', votes: 880, percentage: 33, isWinner: false },
      { name: 'David Obi', votes: 670, percentage: 24, isWinner: false },
    ],
  },
  {
    position: 'Secretary',
    candidates: [
      { name: 'Zainab Mohammed', votes: 1400, percentage: 52, isWinner: true },
      { name: 'Peter Adeleke', votes: 800, percentage: 30, isWinner: false },
      { name: 'Linda Eze', votes: 500, percentage: 18, isWinner: false },
    ],
  },
];

type SectionKey =
  | 'overview'
  | 'tally'
  | 'audit'
  | 'results'
  | 'publish'
  | 'export';

type ResultsSectionKey = `results:${string}`;

type ActiveKey = SectionKey | ResultsSectionKey;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export function ResultsPublishingNewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const electionId = params.electionId;

  const [results] = useState<ElectionResult[]>(MOCK_RESULTS);
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [tallying, setTallying] = useState(false);
  const [tallyComplete, setTallyComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState<ActiveKey>('overview');

  const totalVotes = results.reduce(
    (sum, r) => sum + r.candidates.reduce((s, c) => s + c.votes, 0),
    0
  );
  const totalCandidates = results.reduce((sum, r) => sum + r.candidates.length, 0);
  const winners = results.filter((r) => r.candidates.some((c) => c.isWinner)).length;
  const highestVotes = Math.max(...results.flatMap((r) => r.candidates.map((c) => c.votes)));

  const [tallyLogs, setTallyLogs] = useState<TallyLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      action: 'Tally workspace initialized',
      status: 'info',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      action: 'Source data verified — 3 positions loaded',
      status: 'info',
    },
  ]);

  const appendLog = (action: string, status: TallyLog['status']) => {
    setTallyLogs((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        timestamp: new Date().toISOString(),
        action,
        status,
      },
    ]);
  };

  const handleTallyVotes = () => {
    setTallying(true);
    appendLog('Tally process started', 'pending');
    setTimeout(() => {
      setTallying(false);
      setTallyComplete(true);
      appendLog('All votes tallied and verified', 'success');
    }, 2000);
  };

  const handlePublishResults = () => {
    setShowPublishConfirm(false);
    setIsPublished(true);
    appendLog('Results published to public portal', 'success');
  };

  const handleExportResults = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['Position', 'Candidate Name', 'Votes', 'Percentage', 'Winner'];
      const rows: string[][] = [];
      results.forEach((result) => {
        result.candidates.forEach((candidate) => {
          rows.push([
            result.position,
            candidate.name,
            candidate.votes.toString(),
            `${candidate.percentage}%`,
            candidate.isWinner ? 'YES' : 'NO',
          ]);
        });
      });
      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `election-results-${electionId || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert('Preparing PDF export...');
    }
  };

  // Scroll the selected position into view when a results sub-item is clicked.
  useEffect(() => {
    if (typeof active === 'string' && active.startsWith('results:')) {
      const slug = active.slice('results:'.length);
      const el = document.getElementById(`position-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [active]);

  const select = (key: ActiveKey) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: '2-digit',
    });

  const logStatusStyle: Record<TallyLog['status'], string> = {
    success: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    info: 'bg-slate-100 text-slate-700',
  };

  // Sidebar nav model — keeps render tidy
  const mainNavItems: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'tally', label: 'Tally Votes', icon: <Calculator className="w-5 h-5" /> },
    { key: 'audit', label: 'Audit Log', icon: <Clock className="w-5 h-5" /> },
    { key: 'results', label: 'Results by Position', icon: <ListChecks className="w-5 h-5" /> },
    { key: 'publish', label: 'Publish Results', icon: <Send className="w-5 h-5" /> },
    { key: 'export', label: 'Export Results', icon: <Download className="w-5 h-5" /> },
  ];

  const isActiveKey = (key: ActiveKey) => active === key;
  const isInResultsGroup =
    active === 'results' || (typeof active === 'string' && active.startsWith('results:'));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">UEVS Results</p>
              <p className="text-[11px] text-slate-500 leading-tight">Officer Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="p-6 border-b hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">UEVS Results</p>
                <p className="text-xs text-slate-500">Officer Portal</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 lg:py-6 px-3 overflow-y-auto pt-20 lg:pt-6 space-y-1">
            {mainNavItems.map((item) => {
              const isActive =
                isActiveKey(item.key) || (item.key === 'results' && isInResultsGroup);
              return (
                <button
                  key={item.key}
                  onClick={() => select(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Position sub-items (visible when in the Results group) */}
            <div className="pt-3 mt-3 border-t border-slate-200">
              <p className="px-4 pt-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Jump to Position
              </p>
              {results.map((r) => {
                const key = `results:${slugify(r.position)}` as ActiveKey;
                const isActive = isActiveKey(key);
                return (
                  <button
                    key={r.position}
                    onClick={() => select(key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="truncate">{r.position}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        {/* Thin top bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  Publish Election Results
                </h1>
                <p className="text-xs text-slate-500 truncate">
                  Tally votes, audit outcomes, and publish official results
                </p>
              </div>
            </div>
            {isPublished ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs sm:text-sm font-medium shrink-0">
                <CheckCircle className="w-4 h-4" />
                Results Published
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs sm:text-sm font-medium shrink-0">
                <Clock className="w-4 h-4" />
                Awaiting Publication
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* OVERVIEW */}
          {active === 'overview' && (
            <>
              {!isPublished && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Before you publish</h3>
                  </div>
                  <ul className="text-blue-800 text-sm grid sm:grid-cols-2 gap-x-6 gap-y-1">
                    <li>• Ensure the voting period has ended</li>
                    <li>• Verify all votes have been counted</li>
                    <li>• Review results for accuracy</li>
                    <li>• Results cannot be modified after publication</li>
                  </ul>
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewStat
                  icon={<Award className="w-6 h-6" />}
                  label="Positions"
                  value={results.length}
                  color="indigo"
                />
                <OverviewStat
                  icon={<Users className="w-6 h-6" />}
                  label="Candidates"
                  value={totalCandidates}
                  color="blue"
                />
                <OverviewStat
                  icon={<Vote className="w-6 h-6" />}
                  label="Total Votes Cast"
                  value={totalVotes.toLocaleString()}
                  color="purple"
                />
                <OverviewStat
                  icon={<Trophy className="w-6 h-6" />}
                  label="Winners Determined"
                  value={`${winners} / ${results.length}`}
                  color="emerald"
                />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Publication Readiness
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Step-by-step readiness for releasing official results
                </p>
                <ol className="space-y-4">
                  <ChecklistRow
                    step={1}
                    title="Votes have been tallied"
                    done={tallyComplete}
                    description="Aggregate and verify counts for every position."
                  />
                  <ChecklistRow
                    step={2}
                    title="Results reviewed by officers"
                    done={tallyComplete}
                    description="Confirm winners and percentages match the source data."
                  />
                  <ChecklistRow
                    step={3}
                    title="Results published to the public portal"
                    done={isPublished}
                    description="Make the official outcome visible to all students."
                  />
                </ol>
              </div>
            </>
          )}

          {/* TALLY */}
          {active === 'tally' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Run Vote Tally</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Aggregate and verify all submitted votes for this election.
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                    tallyComplete
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {tallyComplete ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> Tally Verified
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Not Yet Tallied
                    </>
                  )}
                </span>
              </div>

              <button
                onClick={handleTallyVotes}
                disabled={tallying || tallyComplete}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {tallying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Tallying Votes...
                  </>
                ) : tallyComplete ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Tally Complete
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Start Vote Tally
                  </>
                )}
              </button>
            </div>
          )}

          {/* AUDIT LOG */}
          {active === 'audit' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Audit Log</h2>
              <p className="text-sm text-slate-500 mb-5">
                Every action taken during the tally and publication process
              </p>
              <ul className="space-y-3">
                {tallyLogs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <li
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <span
                        className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded ${logStatusStyle[log.status]}`}
                      >
                        {log.status}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800">{log.action}</p>
                        <p className="text-xs text-slate-500">{formatTime(log.timestamp)}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* RESULTS — parent view shows all positions; sub-selection scrolls and dims others */}
          {(active === 'results' || (typeof active === 'string' && active.startsWith('results:'))) && (
            <>
              {!tallyComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    Run the vote tally from the <span className="font-semibold">Tally Votes</span>{' '}
                    panel to verify these numbers before publishing.
                  </div>
                </div>
              )}

              {results.map((result) => {
                const slug = slugify(result.position);
                const selectedPosition =
                  typeof active === 'string' && active.startsWith('results:')
                    ? active.slice('results:'.length)
                    : null;
                const isFaded =
                  selectedPosition !== null && selectedPosition !== slug;
                const winner = result.candidates.find((c) => c.isWinner);
                const totalForPosition = result.candidates.reduce((s, c) => s + c.votes, 0);
                return (
                  <div
                    key={result.position}
                    id={`position-${slug}`}
                    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-6 transition-opacity ${
                      isFaded ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {result.position}
                        </h3>
                        {winner && (
                          <p className="text-indigo-100 text-sm mt-0.5 flex items-center gap-1.5">
                            <Trophy className="w-4 h-4" />
                            Winner: {winner.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-indigo-100 text-sm shrink-0">
                        <p>Total votes</p>
                        <p className="text-xl font-bold text-white">
                          {totalForPosition.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {result.candidates.map((candidate) => {
                        const isHighest = candidate.votes === highestVotes;
                        return (
                          <div
                            key={candidate.name}
                            className={`p-4 rounded-lg border ${
                              candidate.isWinner
                                ? 'border-amber-300 bg-amber-50'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {candidate.isWinner ? (
                                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <Trophy className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold">
                                      {candidate.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p
                                    className={`font-semibold truncate ${
                                      candidate.isWinner ? 'text-amber-900' : 'text-slate-900'
                                    }`}
                                  >
                                    {candidate.name}
                                  </p>
                                  <p
                                    className={`text-xs ${
                                      candidate.isWinner ? 'text-amber-700' : 'text-slate-500'
                                    }`}
                                  >
                                    {candidate.isWinner
                                      ? 'Winner'
                                      : isHighest
                                      ? 'Top contender'
                                      : 'Candidate'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xl font-bold text-slate-900">
                                  {candidate.votes.toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-slate-500">
                                  {candidate.percentage}%
                                </p>
                              </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  candidate.isWinner
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                    : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
                                }`}
                                style={{ width: `${candidate.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* PUBLISH */}
          {active === 'publish' && (
            <>
              {!tallyComplete && (
                <div className="mb-0 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Tally has not been completed yet. Run the tally from{' '}
                    <span className="font-semibold">Tally Votes</span> before publishing.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Publish Official Results
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Once published, results will be visible to all students and cannot be
                      modified.
                    </p>
                  </div>
                </div>

                {isPublished ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2 text-emerald-800">
                      <CheckCircle className="w-5 h-5" />
                      <h3 className="font-semibold">Results Are Published</h3>
                    </div>
                    <p className="text-emerald-800 text-sm mb-4">
                      Official election results are now published and visible to all students.
                      Results cannot be modified.
                    </p>
                    <button
                      onClick={() => navigate('/officer/dashboard')}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPublishConfirm(true)}
                    disabled={!tallyComplete}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    Publish Results
                  </button>
                )}
              </div>

              {isPublished && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      Students will see the published results on the public portal
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      An audit log entry is recorded for this action
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      Winners will be notified via the platform
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* EXPORT */}
          {active === 'export' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900">Export Results</h2>
              <p className="text-sm text-slate-500 mt-1 mb-5">
                Download the official results for record-keeping.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleExportResults('csv')}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportResults('pdf')}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Confirm Results Publication
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Are you sure you want to publish these results? This action cannot be undone and
                results will become visible to all students immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishResults}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                  Publish Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'indigo' | 'blue' | 'purple' | 'emerald';
}) {
  const colorMap: Record<typeof color, string> = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600 mt-1">{label}</p>
    </div>
  );
}

function ChecklistRow({
  step,
  title,
  done,
  description,
}: {
  step: number;
  title: string;
  done: boolean;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
          done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {done ? <CheckCircle className="w-4 h-4" /> : step}
      </div>
      <div>
        <p
          className={`font-medium ${
            done ? 'text-slate-900 line-through decoration-emerald-500/40' : 'text-slate-900'
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </li>
  );
}
