import { useState } from 'react';
import { TextField, Button, FormControlLabel, Switch, Alert } from '@mui/material';
import { useCreateQuiz } from '../../quizzes/adminQuizApi'

interface QuizFormProps {
  courseId: string;
  onSuccess: (quizId: string) => void;
}

const QuizForm = ({ courseId, onSuccess }: QuizFormProps) => {
  const [title, setTitle] = useState('');
  const [timeLimitMins, setTimeLimitMins] = useState('');
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [passingScore, setPassingScore] = useState('50');

  const createQuiz = useCreateQuiz();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuiz.mutate(
      {
        title,
        courseId,
        timeLimitMins: timeLimitMins ? parseInt(timeLimitMins, 10) : undefined,
        negativeMarking,
        passingScore: parseInt(passingScore, 10),
      },
      { onSuccess: (quiz) => onSuccess(quiz.id) }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      {createQuiz.isError && <Alert severity="error">Failed to create quiz.</Alert>}

      <TextField label="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth size="small" />

      <div className="flex gap-3">
        <TextField
          label="Time limit (minutes, optional)"
          type="number"
          value={timeLimitMins}
          onChange={(e) => setTimeLimitMins(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Passing score (%)"
          type="number"
          value={passingScore}
          onChange={(e) => setPassingScore(e.target.value)}
          size="small"
          fullWidth
        />
      </div>

      <FormControlLabel
        control={<Switch checked={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} />}
        label="Enable negative marking"
      />

      <Button type="submit" variant="contained" disableElevation disabled={createQuiz.isPending} sx={{ alignSelf: 'flex-start' }}>
        {createQuiz.isPending ? 'Creating...' : 'Create quiz'}
      </Button>
    </form>
  );
};

export default QuizForm;