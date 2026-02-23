import type { Question, QuizFormState } from '@/stores/QuizFormStore';
import { createQuizStore } from '@/stores/QuizFormStore';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    text: 'What is 2+2?',
    choices: [
      { id: 'c1', text: '3' },
      { id: 'c2', text: '4' },
      { id: 'c3', text: '5' },
      { id: 'c4', text: '6' },
    ],
    order: 1,
    timeLimitSeconds: 30,
    correctChoiceId: 'c2',
    ...overrides,
  };
}

function makeInitialState(
  overrides: Partial<QuizFormState> = {},
): QuizFormState {
  return {
    id: 'quiz-1',
    title: 'Sample Quiz',
    description: 'A sample quiz',
    topics: ['math'],
    questions: [],
    ...overrides,
  };
}

describe('QuizFormStore', () => {
  let store: ReturnType<typeof createQuizStore>;

  beforeEach(() => {
    store = createQuizStore(makeInitialState());
  });

  const actions = () => store.getState().actions;
  const state = () => store.getState();

  
  describe('addQuestion', () => {
    it('should add a question to an empty list', () => {
      actions().addQuestion(makeQuestion());

      expect(state().questions).toHaveLength(1);
      expect(state().questions[0].text).toBe('What is 2+2?');
    });

    it('should prepend new questions and re-number order', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', text: 'First' }));
      actions().addQuestion(makeQuestion({ id: 'q2', text: 'Second' }));
      // order is now q2(1) q1(2)

      const qs = state().questions;
      expect(qs).toHaveLength(2);
      expect(qs[0].id).toBe('q2');
      expect(qs[0].order).toBe(1);
      expect(qs[1].id).toBe('q1');
      expect(qs[1].order).toBe(2);
    });
  });

  describe('removeQuestion', () => {
    it('should remove a question by id and re-number order', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().addQuestion(makeQuestion({ id: 'q2' }));
      actions().addQuestion(makeQuestion({ id: 'q3' }));
      // order is now q3(1), q2(2), q1(3)

      actions().removeQuestion('q2');

      const qs = state().questions;
      expect(qs).toHaveLength(2);
      expect(qs.map((q) => q.id)).toEqual(['q3', 'q1']);
      expect(qs[0].order).toBe(1);
      expect(qs[1].order).toBe(2);
    });

    it('should do nothing when removing a non-existent question', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().removeQuestion('non-existent');

      expect(state().questions).toHaveLength(1);
    });
  });


  describe('updateQuestionText', () => {
    it('should update the text of an existing question', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', text: 'Old text' }));
      actions().updateQuestionText('q1', 'New text');

      expect(state().questions[0].text).toBe('New text');
    });

    it('should not throw for a non-existent question id', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().updateQuestionText('non-existent', 'whatever');

      // original unchanged
      expect(state().questions[0].text).toBe('What is 2+2?');
    });
  });

  describe('updateQuestionTimeLimit', () => {
    it('should update the time limit of an existing question', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', timeLimitSeconds: 30 }));
      actions().updateQuestionTimeLimit('q1', 60);

      expect(state().questions[0].timeLimitSeconds).toBe(60);
    });

    it('should not throw for a non-existent question id', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', timeLimitSeconds: 30 }));
      actions().updateQuestionTimeLimit('non-existent', 60);

      expect(state().questions[0].timeLimitSeconds).toBe(30);
    });
  });

  describe('updateChoice', () => {
    it('should update the text of a specific choice', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().updateChoice('q1', 'c1', 'Updated choice text');

      const choices = state().questions[0].choices;
      expect(choices.find((c) => c.id === 'c1')!.text).toBe(
        'Updated choice text',
      );
    });

    it('should not throw for a non-existent choice id', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().updateChoice('q1', 'non-existent', 'text');

      // all choices unchanged
      expect(state().questions[0].choices[0].text).toBe('3');
    });

    it('should not throw for a non-existent question id', () => {
      actions().addQuestion(makeQuestion({ id: 'q1' }));
      actions().updateChoice('non-existent', 'c1', 'text');

      expect(state().questions[0].choices[0].text).toBe('3');
    });
  });


  describe('updateCorrectChoice', () => {
    it('should update the correct choice for a question', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', correctChoiceId: 'c2' }));
      actions().updateCorrectChoice('q1', 'c3');

      expect(state().questions[0].correctChoiceId).toBe('c3');
    });

    it('should not throw for a non-existent question id', () => {
      actions().addQuestion(makeQuestion({ id: 'q1', correctChoiceId: 'c2' }));
      actions().updateCorrectChoice('non-existent', 'c3');

      expect(state().questions[0].correctChoiceId).toBe('c2');
    });
  });

  describe('addTopic', () => {
    it('should append a topic', () => {
      actions().addTopic('science');

      expect(state().topics).toEqual(['math', 'science']);
    });
  });


  describe('removeTopic', () => {
    it('should remove a topic by index', () => {
      actions().addTopic('science');
      actions().addTopic('history');
      // topics: ['math', 'science', 'history']

      actions().removeTopic(1);

      expect(state().topics).toEqual(['math', 'history']);
    });

    it('should do nothing when index is out of bounds', () => {
      actions().removeTopic(99);

      expect(state().topics).toEqual(['math']);
    });
  });


  describe('updateTitle', () => {
    it('should update the quiz title', () => {
      actions().updateTitle('New Title');
      expect(state().title).toBe('New Title');
    });
  });


  describe('updateDescription', () => {
    it('should update the quiz description', () => {
      actions().updateDescription('New Description');
      expect(state().description).toBe('New Description');
    });
  });


  describe('initial state', () => {
    it('should initialize with the provided state', () => {
      const custom = createQuizStore(
        makeInitialState({
          id: 'custom-id',
          title: 'Custom Quiz',
          topics: ['art', 'music'],
          questions: [
            makeQuestion({ id: 'q1' }),
            makeQuestion({ id: 'q2', order: 2 }),
          ],
        }),
      );

      expect(custom.getState().id).toBe('custom-id');
      expect(custom.getState().title).toBe('Custom Quiz');
      expect(custom.getState().topics).toEqual(['art', 'music']);
      expect(custom.getState().questions).toHaveLength(2);
    });
  });
});
