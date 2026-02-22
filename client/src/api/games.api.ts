import type { ApiResponse } from './types.api';
import type { UserGameMeta } from '@/components/GameHistory/GameCard';
import type { UserGameDetail } from '@/components/GameHistory/GameDetails';
import type { LeaderboardData } from '@/routes/_authenticated/(games)/games_.$gameId_.leaderboard';

export async function getUserGames(): Promise<
  ApiResponse<Array<UserGameMeta>>
> {
  try {
    const res = await fetch('/api/games');
    return await res.json();
  } catch (err) {
    let errorMessage = 'Unknown Error occurred';
    if (err instanceof Error) errorMessage = err.message;
    return {
      data: null,
      error: { code: 'UNKNOWN ERROR', message: errorMessage },
    };
  }
}

export async function getGameDetails(
  gameId: string,
): Promise<ApiResponse<UserGameDetail>> {
  try {
    const res = await fetch(`/api/games/${gameId}`);
    return await res.json();
  } catch (err) {
    let errorMessage = 'Unknown Error occurred';
    if (err instanceof Error) errorMessage = err.message;
    return {
      data: null,
      error: { code: 'UNKNOWN ERROR', message: errorMessage },
    };
  }
}

export async function getGameLeaderboard(
  gameId: string,
  page: number,
): Promise<ApiResponse<LeaderboardData>> {
  try {
    const res = await fetch(`/api/games/${gameId}/rankings?page=${page}`);
    return await res.json();
  } catch (err) {
    let errorMessage = 'Unknown Error occurred';
    if (err instanceof Error) errorMessage = err.message;
    return {
      data: null,
      error: { code: 'UNKNOWN ERROR', message: errorMessage },
    };
  }
}
