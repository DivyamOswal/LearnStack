import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Button } from '@mui/material';
import { useQuizForAttempt, useSubmitQuizAttempt, useQuizLeaderboard } from '@/features/quizzes/quizzesApi';
import QuizAttempt from '@/features/quizzes/components/QuizAttempt';
import QuizResult from '@/features/quizzes/components/QuizResult';
import QuizLeaderboard from '@/features/quizzes/components/QuizLeaderboard';
import EmptyState from '@/components/ui/EmptyState';
import { SubmitAnswerInput, QuizAttemptResult } from '@/features/quizzes/quiz.types';

type ViewState = 'attempt' | 'result' | 'leaderboard';

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [view, setView] = useState<ViewState>('attempt');
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [attemptKey, setAttemptKey] = useState(0); // forces QuizAttempt to remount on retry

  const { data: quiz, isLoading, isError } = useQuizForAttempt(quizId ?? '');
  const submitMutation = useSubmitQuizAttempt(quizId ?? '');
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuizLeaderboard(quizId ?? '');

  const handleSubmit = (answers: SubmitAnswerInput[]) => {
    submitMutation.mutate(answers, {
      onSuccess: (data) => {
        setResult(data);
        setView('result');
      },
    });
  };

  const handleRetry = () => {
    setResult(null);
    setAttemptKey((k) => k + 1);
    setView('attempt');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !quiz) {
    return <EmptyState title="Quiz not found" description="This quiz may have been removed." />;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {view === 'attempt' && (
        <QuizAttempt key={attemptKey} quiz={quiz} onSubmit={handleSubmit} isSubmitting={submitMutation.isPending} />
      )}

      {view === 'result' && result && (
        <QuizResult result={result} onRetry={handleRetry} onViewLeaderboard={() => setView('leaderboard')} />
      )}

      {view === 'leaderboard' && (
        <div className="flex flex-col gap-6 items-center">
          {leaderboardLoading ? (
            <CircularProgress />
          ) : leaderboard && leaderboard.length > 0 ? (
            <QuizLeaderboard entries={leaderboard} />
          ) : (
            <EmptyState title="No attempts yet" description="Be the first to set a score." />
          )}
          <Button onClick={() => setView('result')}>Back to results</Button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;