import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getActiveElections,
  getElectionCandidateVoteTotals,
} from "../services/election";
import type { Election, ElectionCandidate } from "../types";

interface ElectionCandidateWithVotes extends ElectionCandidate {
  vote_count: number;
  user?: { full_name: string; email: string };
  student?: { full_name: string };
  position?: { position_name: string };
}

interface ElectionMonitorEntry {
  election: Election;
  candidates: ElectionCandidateWithVotes[];
  maxVotes: number;
}

const getBarColor = (rank: number) => {
  if (rank === 1) return "bg-emerald-500";
  if (rank === 2) return "bg-orange-500";
  return "bg-rose-500";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const mockMonitorData: ElectionMonitorEntry[] = [
  {
    election: {
      id: "mock-election-1",
      officer_id: "mock-officer",
      title: "SRC General Election 2026",
      description: "Mock election for UI preview.",
      academic_year: "2025 / 2026",
      category: "university",
      scope_id: undefined,
      status: "active",
      nomination_start: undefined,
      nomination_end: undefined,
      voting_start: "2026-06-01T10:00",
      voting_end: "2026-06-05T18:00",
      slot_application_fee: 0,
      enable_payment: false,
      total_voters: 5000,
      total_votes_cast: 2500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    candidates: [
      {
        id: "mock-candidate-1",
        election_id: "mock-election-1",
        user_id: "user-1",
        position_id: "position-1",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 1280,
        profile_image_url:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-1",
          full_name: "Amina Yusuf",
          email: "amina@yourschool.edu",
        },
        position: { id: "position-1", position_name: "President" },
      } as ElectionCandidateWithVotes,
      {
        id: "mock-candidate-2",
        election_id: "mock-election-1",
        user_id: "user-2",
        position_id: "position-1",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 850,
        profile_image_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-2",
          full_name: "David Nwosu",
          email: "david@yourschool.edu",
        },
        position: { id: "position-1", position_name: "President" },
      } as ElectionCandidateWithVotes,
      {
        id: "mock-candidate-3",
        election_id: "mock-election-1",
        user_id: "user-3",
        position_id: "position-1",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 430,
        profile_image_url:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-3",
          full_name: "Sara Bello",
          email: "sara@yourschool.edu",
        },
        position: { id: "position-1", position_name: "President" },
      } as ElectionCandidateWithVotes,
    ],
    maxVotes: 1280,
  },
  {
    election: {
      id: "mock-election-2",
      officer_id: "mock-officer",
      title: "Faculty Union Election",
      description: "Mock faculty-level election preview.",
      academic_year: "2025 / 2026",
      category: "faculty",
      scope_id: "fac-1",
      status: "active",
      nomination_start: undefined,
      nomination_end: undefined,
      voting_start: "2026-06-10T09:00",
      voting_end: "2026-06-12T17:00",
      slot_application_fee: 0,
      enable_payment: false,
      total_voters: 1300,
      total_votes_cast: 760,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    candidates: [
      {
        id: "mock-candidate-4",
        election_id: "mock-election-2",
        user_id: "user-4",
        position_id: "position-2",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 380,
        profile_image_url:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-4",
          full_name: "Chris Ade",
          email: "chris@yourschool.edu",
        },
        position: { id: "position-2", position_name: "Vice President" },
      } as ElectionCandidateWithVotes,
      {
        id: "mock-candidate-5",
        election_id: "mock-election-2",
        user_id: "user-5",
        position_id: "position-2",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 245,
        profile_image_url:
          "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-5",
          full_name: "Esther Kalu",
          email: "esther@yourschool.edu",
        },
        position: { id: "position-2", position_name: "Vice President" },
      } as ElectionCandidateWithVotes,
      {
        id: "mock-candidate-6",
        election_id: "mock-election-2",
        user_id: "user-6",
        position_id: "position-2",
        application_status: "approved",
        payment_status: "successful",
        is_visible_for_voting: true,
        submission_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vote_count: 135,
        profile_image_url:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        user: {
          id: "user-6",
          full_name: "James Obi",
          email: "james@yourschool.edu",
        },
        position: { id: "position-2", position_name: "Vice President" },
      } as ElectionCandidateWithVotes,
    ],
    maxVotes: 380,
  },
];

export function ElectionMonitoringPage() {
  const { user } = useAuth();
  const [monitorData, setMonitorData] = useState<ElectionMonitorEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function loadMonitoringData() {
      setIsLoading(true);
      setError("");

      try {
        const elections = await getActiveElections(userId);
        if (elections.length === 0) {
          setMonitorData(mockMonitorData);
          return;
        }

        const results = await Promise.all(
          elections.map(async (election) => {
            const candidates = await getElectionCandidateVoteTotals(
              election.id,
            );
            const sorted = [...candidates].sort(
              (a, b) => b.vote_count - a.vote_count,
            );
            const maxVotes = Math.max(
              1,
              ...sorted.map((candidate) => candidate.vote_count),
            );
            return {
              election,
              candidates: sorted,
              maxVotes,
            };
          }),
        );

        if (results.length === 0) {
          setMonitorData(mockMonitorData);
        } else {
          setMonitorData(results);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load election monitoring data. Please refresh the page.",
        );
        setMonitorData(mockMonitorData);
      } finally {
        setIsLoading(false);
      }
    }

    loadMonitoringData();
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-blue-600">
              Election Monitoring
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Live vote tracking for your elections
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              See each election with its candidates below, and compare live vote
              performance using color-ranked vote bars.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Highest vote candidate
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex h-56 items-center justify-center text-slate-500">
            Loading election monitoring...
          </div>
        ) : monitorData.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            <p>No active elections available for monitoring.</p>
            <p className="mt-2 text-sm">
              Publish an election and add candidates to begin live monitoring.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {monitorData.map(({ election, candidates, maxVotes }) => (
              <div key={election.id} className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {election.category} election
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        {election.title}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {election.academic_year} · {election.voting_start} to{" "}
                        {election.voting_end}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      {candidates.length} candidates tracked
                    </div>
                  </div>
                </div>

                {candidates.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    <p>
                      No approved candidates have been added to this election
                      yet.
                    </p>
                    <p className="mt-2 text-sm">
                      Candidates appear here once they are approved and start
                      receiving votes.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {candidates.map((candidate, index) => {
                      const rank = index + 1;
                      const barHeight = Math.max(
                        18,
                        Math.round((candidate.vote_count / maxVotes) * 100),
                      );
                      return (
                        <div
                          key={candidate.id}
                          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                              {candidate.profile_image_url ? (
                                <img
                                  src={candidate.profile_image_url}
                                  alt={candidate.user?.full_name ?? "Candidate"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-600">
                                  {getInitials(
                                    candidate.user?.full_name ??
                                      candidate.student?.full_name ??
                                      "NA",
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                {candidate.position?.position_name ??
                                  "Candidate"}
                              </p>
                              <h3 className="truncate text-base font-semibold text-slate-900">
                                {candidate.user?.full_name ??
                                  candidate.student?.full_name ??
                                  "Unknown"}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {candidate.user?.email ??
                                  candidate.student?.full_name}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-end gap-3">
                            <div className="flex h-32 w-10 flex-col justify-end overflow-hidden rounded-2xl bg-slate-100">
                              <div
                                className={`${getBarColor(rank)} w-full transition-all duration-300`}
                                style={{ height: `${barHeight}%` }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {candidate.vote_count} vote
                                {candidate.vote_count === 1 ? "" : "s"}
                              </p>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                                {rank === 1
                                  ? "Top performer"
                                  : rank === 2
                                    ? "Second place"
                                    : "Competitor"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
