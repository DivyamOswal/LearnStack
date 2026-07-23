import { Typography, Button, Chip } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { QuizSummary } from '../quiz.types';

interface QuizStartCardProps {
  quiz: QuizSummary;
  onStart: () => void;
}

const QuizStartCard = ({ quiz, onStart }: QuizStartCardProps) => {
  return (
    <div className="border rounded-lg p-5 flex flex-col gap-3" style={{ borderColor: 'inherit' }}>
      <div className="flex items-start justify-between gap-2">
        <Typography sx={{ fontWeight: 600 }}>{quiz.title}</Typography>
        {quiz.negativeMarking && (
          <Chip label="negative marking" size="small" className="font-mono-ui" color="warning" variant="outlined" />
        )}
      </div>

      <div className="flex items-center gap-4 font-mono-ui text-sm" style={{ color: 'inherit', opacity: 0.7 }}>
        <span className="flex items-center gap-1">
          <QuizOutlinedIcon sx={{ fontSize: 16 }} />
          {quiz._count.questions} questions
        </span>
        {quiz.timeLimitMins && (
          <span className="flex items-center gap-1">
            <TimerOutlinedIcon sx={{ fontSize: 16 }} />
            {quiz.timeLimitMins} min
          </span>
        )}
        <span>pass: {quiz.passingScore}%</span>
      </div>

      <Button variant="contained" disableElevation onClick={onStart} sx={{ alignSelf: 'flex-start' }}>
        Start quiz
      </Button>
    </div>
  );
};

export default QuizStartCard;