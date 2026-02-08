import {
  Crown,
  Flame,
  Medal,
  MoreHorizontal,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import UserAvatar from '../UserAvatar';
import type { Submission } from '@/stores/MemberStore';
import type { RankInfo } from '@/stores/GameStore';
import { useGameRoom, useRankings } from '@/stores/GameStore';
import { useMember, useMemberSubmissions } from '@/stores/MemberStore';

export default function LeaderBoardView() {
  return (
    <div className="flex flex-col gap-6">
      <GameSummary />
      <Rankings />
    </div>
  );
}

function GameSummary() {
  const room = useGameRoom();
  const member = useMember();
  const submissions = useMemberSubmissions();

  const hostname = room.host.name;
  const { title, description, totalQuestions } = room.quizMeta;

  const accuracy = calculateAccuracy(submissions, totalQuestions);
  const streak = calculateLongestStreak(submissions);

  return (
    <div className="overflow-hidden rounded-2xl bg-vibrant-coral-50 shadow-sm">
      <div className="p-6 sm:p-8 grid gap-4 bg-linear-to-br from-primary-200 to-primary-100 border">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-14 border-2 border-gray-800 bg-white rounded-xl shadow-lg grid place-items-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-deep-space-blue-400">
            <Trophy size={32} className="stroke-accent-500" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">
              Hosted by <span className="text-sm">{hostname}</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {member.role === 'SPECTATOR' ? (
          <p className="text-sm leading-relaxed">{description}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              icon={<TrendingUp className="stroke-emerald-400" size={20} />}
              label="Score"
              value={member.score}
              subtext="Points"
              colorClass="bg-emerald-500/50"
            />
            <StatCard
              icon={<Zap className="fill-amber-400 stroke-none" size={20} />}
              label="Accuracy"
              value={`${accuracy}%`}
              subtext="Correct"
              colorClass="bg-amber-500/50"
            />
            <StatCard
              icon={<Flame className="fill-rose-400 stroke-none" size={20} />}
              label="Best Streak"
              value={streak}
              subtext="In a row"
              colorClass="bg-rose-500/50"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, colorClass }: any) {
  return (
    <div
      className={`flex relative flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-600 ${colorClass} backdrop-blur-sm`}
    >
      <div className="absolute p-1 rounded-md px-2 bg-white border top-0 -translate-y-1/2 flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
      <div className="text-xs text-text-800 font-medium mt-1">{subtext}</div>
    </div>
  );
}

function Rankings() {
  const rankings = useRankings();

  const sortedRankings = [...rankings].sort((a, b) => b.score - a.score);

  const topThree = sortedRankings.slice(0, 3);
  const restList = sortedRankings.slice(3);

  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold tracking-wider">
        <span className="flex items-center gap-4">
          <Medal size={24} />
          Rankings
        </span>
        <div className="h-1 w-1/3 bg-secondary-300 mt-2" />
      </h2>

      {topThree.length > 0 && (
        <div className="grid border-b-4 border-accent-500 grid-cols-3 gap-2 sm:gap-4 items-end mt-6">
          {topThree[1] && (
            <PodiumStep
              player={topThree[1]}
              rank={2}
              color="bg-slate-300"
              accent="text-slate-700"
              height="h-32"
            />
          )}

          {topThree[0] && (
            <PodiumStep
              player={topThree[0]}
              rank={1}
              color="bg-amber-300"
              accent="text-amber-600"
              height="h-40"
              isWinner
            />
          )}

          {topThree[2] && (
            <PodiumStep
              player={topThree[2]}
              rank={3}
              color="bg-orange-400"
              accent="text-orange-400"
              height="h-24"
            />
          )}
        </div>
      )}

      <ListRankings rankings={restList} />
    </div>
  );
}

function ListRankings({ rankings }: { rankings: Array<RankInfo> }) {
  const member = useMember();

  return (
    <div className="overflow-hidden bg-linear-to-b from-secondary-50 to-secondary-100 rounded-xl border-2 border-gray-600 shadow-lg">
      <div className="grid grid-cols-[60px_1fr_80px] gap-4 p-3 bg-secondary-300 text-xs font-semibold uppercase tracking-wider border-b border-gray-800">
        <div>Rank</div>
        <div>Player</div>
        <div className="text-center">Score</div>
      </div>

      <div className="divide-y divide-slate-500/50">
        {rankings.map((r) => {
          const isMe = r.id === member.id;

          return (
            <div
              key={r.id}
              className={`grid grid-cols-[60px_1fr_80px] gap-4 p-3 items-center transition-colors 
                  ${isMe ? 'bg-primary-50 hover:bg-primary-200' : 'hover:bg-secondary-200'}
                `}
            >
              <div className="text-center font-bold">{r.rank}</div>
              <div className="grid grid-cols-[auto_1fr] items-center gap-3 overflow-hidden">
                <UserAvatar name={r.name} />
                <span className="font-medium truncate">
                  {r.name}
                  {isMe && (
                    <span className="text-xs ml-2 py-0.5 px-1.5 rounded bg-primary-700 text-white">
                      YOU
                    </span>
                  )}
                </span>
              </div>
              <div className="text-center font-semibold">
                {r.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {rankings.length === 0 && (
        <div className="p-8 text-center">
          <MoreHorizontal className="mx-auto mb-2 opacity-50" />
          <p>No more players to show</p>
        </div>
      )}
    </div>
  );
}

function PodiumStep({
  player,
  rank,
  color,
  accent,
  height,
  isWinner = false,
}: {
  player: any;
  rank: number;
  color: string;
  accent: string;
  height: string;
  isWinner?: boolean;
}) {
  const column = rank == 1 ? 2 : rank == 2 ? 1 : 3;
  return (
    <div className={`col-start-${column}` + ' flex flex-col items-center'}>
      <div
        className={`relative mb-3 transition-transform duration-300 ${isWinner ? 'scale-110' : 'scale-100'}`}
      >
        <div
          className={`rounded-full p-1 ${isWinner ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-slate-700'}`}
        >
          <UserAvatar name={player.name} size={isWinner ? 'lg' : 'sm'} />
        </div>
        {isWinner && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
            <Crown size={24} className="text-amber-400 fill-amber-400" />
          </div>
        )}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 size-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 border-2 border-slate-900 ${color}`}
        >
          {rank}
        </div>
      </div>

      <div className="text-center mb-2 z-10">
        <div
          className={`font-bold truncate max-w-20 sm:max-w-30 ${isWinner ? 'text-text-950' : 'text-text-800'}`}
        >
          {player.name}
        </div>
        <div className={`font-bold ${accent}`}>{player.score}</div>
      </div>

      <div
        className={`w-full ${height} ${color} bg-opacity-20 rounded-t-xl border-t border-x border-white/10 backdrop-blur-md relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-50`}
        ></div>
      </div>
    </div>
  );
}

function calculateAccuracy(
  submissions: Array<Submission>,
  totalQuestions: number,
) {
  if (totalQuestions === 0) return 0;
  const correctCount = submissions.reduce(
    (curr, sub) => (sub.isCorrect ? curr + 1 : curr),
    0,
  );
  return Math.ceil((correctCount / totalQuestions) * 100);
}

function calculateLongestStreak(submissions: Array<Submission>) {
  const sortedSubmissions = [...submissions].sort(
    (a, b) => a.submittedAt - b.submittedAt,
  );

  let longestStreak = 0;
  let streakCounter = 0;
  for (const sub of sortedSubmissions) {
    if (sub.isCorrect) {
      streakCounter++;
      longestStreak = Math.max(streakCounter, longestStreak);
    } else {
      streakCounter = 0;
    }
  }

  return longestStreak;
}
