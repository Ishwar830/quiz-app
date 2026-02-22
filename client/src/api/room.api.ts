import type { GameState } from '@/stores/GameStore';
import type { ApiResponse } from './types.api';
import type { MemberState } from '@/stores/MemberStore';

export async function getGameStatus(
  roomId: string,
): Promise<ApiResponse<{ gameState: GameState; memberState: MemberState }>> {
  try {
    const res = await fetch(`/api/rooms/${roomId}`);
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
