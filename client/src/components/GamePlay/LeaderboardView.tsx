import { Crown, Medal, MoreHorizontal, Trophy } from 'lucide-react';
import UserAvatar from '../UserAvatar';
import { StatCardsGrid } from '../General/StatCards';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { RankInfo } from '@/stores/GameStore';
import { useGameRoom, useRankings } from '@/stores/GameStore';
import { useMember, useMemberSubmissions } from '@/stores/MemberStore';
import { calculateAccuracy, calculateLongestStreak } from '@/lib/utils';

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
    <Card className="relative overflow-hidden bg-linear-to-br from-primary-300 to-primary-500">
      <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 size-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <CardHeader>
        <div className="flex gap-2">
          <div className="shrink-0 grow-0 size-14 rounded-xl shadow-lg grid place-items-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 bg-accent-50">
            <Trophy size={32} className="stroke-accent-500" />
          </div>
          <div>
            <p className="text-xs space-x-2">
              <span>Hosted by</span>
              <span className="text-sm font-bold">{hostname}</span>
            </p>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {member.role === 'SPECTATOR' ? (
          <p className="leading-relaxed text-sm">{description}</p>
        ) : (
          <StatCardsGrid
            score={member.score ?? 0}
            accuracy={accuracy}
            streak={streak}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Rankings() {
  const rankings = useRankings();

  const sortedRankings = [...rankings].sort((a, b) => b.score - a.score);

  const topThree = sortedRankings.slice(0, 3);
  const restList = sortedRankings.slice(3);

  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100">
          <Medal size={18} className="stroke-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-900">Rankings</h2>
          <p className="text-xs text-text-400">Top performers this round</p>
        </div>
      </div>

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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-[60px_1fr_80px] gap-4 px-5 py-3 bg-primary-300 border-b border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Rank
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Player
        </span>
        <span className="text-[10px] text-center font-bold uppercase tracking-widest">
          Score
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {rankings.map((r) => {
          return (
            <div
              key={r.userId}
              className={`grid grid-cols-[60px_1fr_80px] gap-4 px-5 py-3 items-center transition-colors duration-200 hover:bg-primary-50`}
            >
              <span className="text-center font-bold text-sm text-text-500 tabular-nums">
                {r.rank}
              </span>

              <div className="flex items-center gap-3 overflow-hidden">
                <UserAvatar name={r.name} />
                <span className="font-medium text-sm text-text-800 truncate">
                  {r.name}
                </span>
              </div>

              <span className="text-center font-bold text-sm text-text-700 tabular-nums">
                {r.score.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      {rankings.length === 0 && (
        <div className="p-8 text-center text-sm">
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
    <div className={`col-start-${column} flex flex-col items-center relative`}>
      <div
        className={`relative mb-3 transition-transform duration-300 ${isWinner ? 'scale-110' : 'scale-100'}`}
      >
        <div
          className={`rounded-full p-1 ${isWinner ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'bg-slate-700'}`}
        >
          <UserAvatar name={player.name} size="lg" />
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

      <div className="text-center mb-2 z-1">
        <div
          className={`font-bold truncate max-w-20 sm:max-w-30 ${isWinner ? 'text-text-950' : 'text-text-800'}`}
        >
          {player.name}
        </div>
        <div className={`font-bold ${accent}`}>{player.score}</div>
      </div>

      <div
        className={`w-full ${height} ${color} rounded-t-xl relative overflow-hidden`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-white/50">{rank}</span>
        </div>
      </div>
    </div>
  );
}
