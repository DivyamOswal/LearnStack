import { useState, useCallback } from 'react';
import { Typography, Button, Checkbox, Radio, FormControlLabel, Chip, LinearProgress } from '@mui/material';
import { QuizForAttempt, SubmitAnswerInput } from '../quiz.types';
import { useQuizTimer } from '../hooks/useQuizTimer';

interface QuizAttemptProps {
  quiz: QuizForAttempt;
  onSubmit: (answers: SubmitAnswerInput[]) => void;
  isSubmitting: boolean;
}

const QuizAttempt = ({ quiz, onSubmit, isSubmitting }: QuizAttemptProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});

  const handleAutoSubmit = useCallback(() => {
    const answers: SubmitAnswerInput[] = Object.entries(answersMap).map(([questionId, selectedAnswerIds]) => ({
      questionId,
      selectedAnswerIds,
    }));
    onSubmit(answers);
  }, [answersMap, onSubmit]);

  const { formattedTime, secondsLeft } = useQuizTimer(quiz.timeLimitMins, handleAutoSubmit);

  const questions = quiz.questions.slice().sort((a, b) => a.order - b.order);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isMultiSelect = currentQuestion.type === 'MULTIPLE_ANSWER';

  const selectedForCurrent = answersMap[currentQuestion.id] ?? [];

  const handleSelect = (answerId: string) => {
    setAnswersMap((prev) => {
      if (isMultiSelect) {
        const current = prev[currentQuestion.id] ?? [];
        const next = current.includes(answerId)
          ? current.filter((id) => id !== answerId)
          : [...current, answerId];
        return { ...prev, [currentQuestion.id]: next };
      }
      return { ...prev, [currentQuestion.id]: [answerId] };
    });
  };

  const handleSubmitAttempt = () => {
    const answers: SubmitAnswerInput[] = Object.entries(answersMap).map(([questionId, selectedAnswerIds]) => ({
      questionId,
      selectedAnswerIds,
    }));
    onSubmit(answers);
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const isTimeCritical = secondsLeft !== null && secondsLeft <= 30;

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="body2" color="text.secondary" className="font-mono-ui">
          question {currentIndex + 1} / {questions.length}
        </Typography>
        {formattedTime && (
          <Chip
            label={formattedTime}
            size="small"
            className="font-mono-ui"
            color={isTimeCritical ? 'error' : 'default'}
            sx={{ bgcolor: isTimeCritical ? undefined : 'action.hover' }}
          />
        )}
      </div>

      <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 4, borderRadius: 2 }} />

      <Typography variant="h6" sx={{ fontSize: '1.15rem' }}>
        {currentQuestion.text}
      </Typography>

      {isMultiSelect && (
        <Typography variant="caption" color="text.secondary">
          Select all that apply.
        </Typography>
      )}

      <div className="flex flex-col gap-2">
        {currentQuestion.answers.map((answer) => (
          <label
            key={answer.id}
            className="flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors"
            style={{
              borderColor: selectedForCurrent.includes(answer.id) ? 'var(--mui-palette-primary-main, #2DD4BF)' : 'inherit',
            }}
          >
            {isMultiSelect ? (
              <Checkbox checked={selectedForCurrent.includes(answer.id)} onChange={() => handleSelect(answer.id)} size="small" />
            ) : (
              <Radio checked={selectedForCurrent.includes(answer.id)} onChange={() => handleSelect(answer.id)} size="small" />
            )}
            <Typography variant="body2">{answer.text}</Typography>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-2">
        <Button disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
          Previous
        </Button>

        {isLastQuestion ? (
          <Button variant="contained" disableElevation onClick={handleSubmitAttempt} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit quiz'}
          </Button>
        ) : (
          <Button variant="contained" disableElevation onClick={() => setCurrentIndex((i) => i + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;