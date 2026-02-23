import type { GameState, Question, RankInfo } from '@/stores/GameStore';
import { createGameStore } from '@/stores/GameStore';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    text: 'What is 2+2?',
    order: 1,
    timeLimitSeconds: 30,
    choices: [
      { id: 'c1', text: '3' },
      { id: 'c2', text: '4' },
    ],
    submissionStartTime: 1000,
    submissionEndTime: 2000,
    ...overrides,
  };
}

function makeInitialState(overrides: Partial<GameState> = {}): GameState {
  return {
    room: {
      id: 'room-1',
      host: { id: 'user-1', name: 'Host' },
      quizMeta: {
        id: 'quiz-1',
        title: 'Test Quiz',
        description: 'A test quiz',
        topics: ['math'],
        totalQuestions: 5,
      },
    },
    status: 'WAITING',
    startedAt: null,
    endedAt: null,
    currentQuestionInfo: makeQuestion(),
    countdownInfo: null,
    topRankings: [],
    ...overrides,
  };
}

describe('GameStore', () => {
  let store: ReturnType<typeof createGameStore>;

  beforeEach(() => {
    store = createGameStore(makeInitialState());
  });

  const actions = () => store.getState().actions;
  const state = () => store.getState();


  describe('initial state', () => {
    it('should initialize with WAITING status', () => {
      expect(state().status).toBe('WAITING');
    });

    it('should initialize with the provided room', () => {
      expect(state().room.id).toBe('room-1');
      expect(state().room.host.name).toBe('Host');
      expect(state().room.quizMeta.title).toBe('Test Quiz');
    });

    it('should initialize with null timestamps', () => {
      expect(state().startedAt).toBeNull();
      expect(state().endedAt).toBeNull();
    });

    it('should initialize with empty rankings', () => {
      expect(state().topRankings).toEqual([]);
    });

    it('should initialize with null countdownInfo', () => {
      expect(state().countdownInfo).toBeNull();
    });
  });

  describe('updateCountdownInfo', () => {
    it('should set countdownInfo and change status to COUNTDOWN', () => {
      const countdown = { duration: 5, endsAt: Date.now() + 5000 };
      actions().updateCountdownInfo(countdown);

      expect(state().status).toBe('COUNTDOWN');
      expect(state().countdownInfo).toEqual(countdown);
    });
  });

  describe('updateQuestionInfo', () => {
    it('should update currentQuestionInfo and set status to QUESTION_ACTIVE', () => {
      const newQuestion = makeQuestion({
        id: 'q2',
        text: 'New question',
        order: 2,
      });
      actions().updateQuestionInfo(newQuestion);

      expect(state().status).toBe('QUESTION_ACTIVE');
      expect(state().currentQuestionInfo.id).toBe('q2');
      expect(state().currentQuestionInfo.text).toBe('New question');
    });

    it('should replace the previous question info', () => {
      actions().updateQuestionInfo(makeQuestion({ id: 'q2', order: 2 }));
      actions().updateQuestionInfo(makeQuestion({ id: 'q3', order: 3 }));

      expect(state().currentQuestionInfo.id).toBe('q3');
      expect(state().currentQuestionInfo.order).toBe(3);
    });
  });

  describe('updateRankings', () => {
    const rankings: Array<RankInfo> = [
      { userId: 'u1', name: 'Alice', rank: 1, score: 100 },
      { userId: 'u2', name: 'Bob', rank: 2, score: 80 },
    ];

    it('should set topRankings', () => {
      actions().updateRankings(rankings);

      expect(state().topRankings).toHaveLength(2);
      expect(state().topRankings[0].name).toBe('Alice');
      expect(state().topRankings[1].score).toBe(80);
    });
  });
});
