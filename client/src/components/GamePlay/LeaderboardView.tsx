import {
  Crown,
  Flame,
  Medal,
  MoreHorizontal,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import type { Submission } from '@/stores/MemberStore';
import type { RankInfo } from '@/stores/GameStore';
import { useGameRoom, useRankings } from '@/stores/GameStore';
import { useMember, useMemberSubmissions } from '@/stores/MemberStore';

export default function LeaderBoardView() {
  return (
    <div className="min-h-screen w-full text-text-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <GameSummary />
        <Rankings />
      </div>
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
    <div className="overflow-hidden rounded-2xl bg-vibrant-coral-50 shadow-lg">
      <div className="p-6 sm:p-8 grid gap-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="size-14 border-2 border-slate-800 rounded-xl shadow-lg grid place-items-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-deep-space-blue-400">
            <Trophy size={32} className="drop-shadow-md stroke-gray-100" />
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
              colorClass="bg-emerald-500/50 border-emerald-500/20"
            />
            <StatCard
              icon={<Zap className="fill-amber-400 stroke-none" size={20} />}
              label="Accuracy"
              value={`${accuracy}%`}
              subtext="Correct"
              colorClass="bg-amber-500/50 border-amber-500/20"
            />
            <StatCard
              icon={<Flame className="fill-rose-400 stroke-none" size={20} />}
              label="Best Streak"
              value={streak}
              subtext="In a row"
              colorClass="bg-rose-500/50 border-rose-500/20"
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
      className={`flex relative flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-600 ${colorClass} backdrop-blur-sm`}
    >
      <div className="absolute p-1 rounded-md px-2 bg-slate-100 top-0 -translate-y-1/2 flex items-center gap-2 mb-2">
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold font-cascadia tracking-wider">
        <span className='flex items-center gap-4'>
          <Medal size={24} />
          Rankings
        </span>
        <div className="h-1 w-1/3 bg-vibrant-coral-200 mt-2" />
      </h2>

      {topThree.length > 0 && (
        <div className="grid border-b-2 border-slate-600 grid-cols-3 gap-2 sm:gap-4 items-end mb-8 pt-4">
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
    <div className="bg-pale-sky-50 rounded-xl border-2 border-slate-600 overflow-hidden shadow-lg">
      <div className="grid grid-cols-[60px_1fr_80px] gap-4 p-3 bg-pale-sky-800/80 text-xs font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800">
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
                  ${isMe ? 'bg-slate-200/10 hover:bg-indigo-500/20' : 'hover:bg-pale-sky-300/40'}
                `}
            >
              <div className="text-center font-bold">{r.rank}</div>
              <div className="flex items-center gap-3">
                <Avatar name={r.name} />
                <span
                  className={`font-medium truncate ${isMe ? 'text-slate-800' : 'text-slate-800'}`}
                >
                  {r.name}
                  {isMe && (
                    <span className="text-xs ml-2 py-0.5 px-1.5 rounded bg-slate-600 text-slate-100">
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
          <Avatar name={player.name} size={isWinner ? 'lg' : 'md'} />
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
        <div className={`font-bold ${accent}`}>
          {player.score}
        </div>
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

function Avatar({
  name,
  size = 'sm',
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const initials = name.slice(0, 2).toUpperCase();

  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  const sizeClasses = {
    sm: 'size-8 text-xs',
    md: 'size-12 text-base',
    lg: 'size-16 text-xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold shadow-inner ring-2 ring-white/10`}
    >
      {initials}
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
