import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getCompletedElections,
  tallyElectionResults,
} from "../services/election";
import type { Election } from "../types";

interface CandidateResult {
  id: string;
  name: string;
  profile_image_url?: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

interface PositionResult {
  positionId: string;
  position: string;
  candidates: CandidateResult[];
}

interface ElectionResultItem {
  election: Election;
  positions: PositionResult[];
}

const mockResults: ElectionResultItem[] = [
  {
    election: {
      id: "mock-election-final-1",
      officer_id: "mock-officer",
      title: "SRC General Election 2026",
      description: "Mock election completed outcomes.",
      academic_year: "2025 / 2026",
      category: "university",
      scope_id: undefined,
      status: "results_published",
      nomination_start: undefined,
      nomination_end: undefined,
      voting_start: "2026-06-01T10:00",
      voting_end: "2026-06-05T18:00",
      slot_application_fee: 0,
      enable_payment: false,
      total_voters: 5200,
      total_votes_cast: 2980,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    positions: [
      {
        positionId: "position-1",
        position: "President",
        candidates: [
          {
            id: "mock-candidate-1",
            name: "Amina Yusuf",
            profile_image_url: "https://i.pravatar.cc/150?img=48",
            votes: 1280,
            percentage: 57,
            isWinner: true,
          },
          {
            id: "mock-candidate-2",
            name: "David Nwosu",
            profile_image_url: "https://i.pravatar.cc/150?img=12",
            votes: 850,
            percentage: 38,
            isWinner: false,
          },
          {
            id: "mock-candidate-3",
            name: "Sara Bello",
            profile_image_url: "https://i.pravatar.cc/150?img=33",
            votes: 180,
            percentage: 8,
            isWinner: false,
          },
        ],
      },
      {
        positionId: "position-2",
        position: "Vice President",
        candidates: [
          {
            id: "mock-candidate-4",
            name: "Chris Ade",
            profile_image_url: "https://i.pravatar.cc/150?img=55",
            votes: 1020,
            percentage: 51,
            isWinner: true,
          },
          {
            id: "mock-candidate-5",
            name: "Esther Kalu",
            profile_image_url: "https://i.pravatar.cc/150?img=7",
            votes: 760,
            percentage: 38,
            isWinner: false,
          },
          {
            id: "mock-candidate-6",
            name: "James Obi",
            profile_image_url: "https://i.pravatar.cc/150?img=18",
            votes: 214,
            percentage: 11,
            isWinner: false,
          },
        ],
      },
    ],
  },
];

export function ElectionResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<ElectionResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    async function loadResults() {
      setIsLoading(true);
      setError("");

      try {
        const elections = await getCompletedElections(user.id);
        if (elections.length === 0) {
          setResults(mockResults);
          return;
        }

        const electionResults = await Promise.all(
          elections.map(async (election) => {
            const tally = await tallyElectionResults(election.id);
            return {
              election,
              positions: tally.map((position) => ({
                positionId: position.positionId,
                position: position.position,
                candidates: position.candidates.map((candidate) => ({
                  id: candidate.id,
                  name: candidate.name,
                  profile_image_url: candidate.profile_image_url,
                  votes: candidate.votes,
                  percentage: candidate.percentage,
                  isWinner: candidate.isWinner,
                })),
              })),
            };
          }),
        );

        if (electionResults.length === 0) {
          setResults(mockResults);
        } else {
          setResults(electionResults);
        }
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load final election results. Please refresh the page.",
        );
        setResults(mockResults);
      } finally {
        setIsLoading(false);
      }
    }

    loadResults();
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-blue-600">
              Final Results
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Election outcomes and winners
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Review final election results with winner status highlighted for
              each position.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Winner status is shown in green
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-slate-500">
            Loading final results...
          </div>
        ) : (
          <div className="space-y-8">
            {results.map(({ election, positions }) => (
              <div
                key={election.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {election.category} election • {election.academic_year}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {election.title}
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    Status: {election.status.replace("_", " ")}
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {positions.map((position) => (
                    <div
                      key={position.positionId}
                      className="rounded-3xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                            {position.position}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">
                            Final ranking
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                          {position.candidates.length} candidates
                        </span>
                      </div>

                      <div className="space-y-3">
                        {position.candidates.map((candidate, idx) => {
                          const avatarUrl =
                            candidate.profile_image_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=2563EB&color=ffffff`;

                          return (
                            <div
                              key={candidate.id}
                              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={avatarUrl}
                                  alt={candidate.name}
                                  className="h-14 w-14 rounded-2xl object-cover"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {candidate.name}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500">
                                    {candidate.votes} votes •{" "}
                                    {candidate.percentage}%
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                                    candidate.isWinner
                                      ? "bg-emerald-500 text-white"
                                      : "bg-slate-200 text-slate-700"
                                  }`}
                                >
                                  {candidate.isWinner
                                    ? "Winner"
                                    : `#${idx + 1}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
