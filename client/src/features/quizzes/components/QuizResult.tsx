import { Typography, Button, LinearProgress } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { QuizAttemptResult } from '../quiz.types';

interface QuizResultProps {
  result: QuizAttemptResult;
  onRetry: () => void;
  onViewLeaderboard: () => void;
}

const QuizResult = ({ result, onRetry, onViewLeaderboard }: QuizResultProps) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-md mx-auto text-center py-8">
      {result.passed ? (
        <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: 'primary.main' }} />
      ) : (
        <CancelOutlinedIcon sx={{ fontSize: 56, color: 'error.main' }} />
      )}

      <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 700 }}>
        {result.score}%
      </Typography>

      <Typography variant="h6" color={result.passed ? 'primary.main' : 'error.main'}>
        {result.passed ? 'Passed' : 'Not passed'}
      </Typography>

      <div className="w-full">
        <LinearProgress
          variant="determinate"
          value={result.score}
          color={result.passed ? 'primary' : 'error'}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </div>

      <Typography variant="body2" color="text.secondary" className="font-mono-ui">
        {result.rawScore} / {result.maxPossibleScore} points
      </Typography>

      <div className="flex gap-3 mt-4">
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
        <Button variant="contained" disableElevation onClick={onViewLeaderboard}>
          View leaderboard
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;