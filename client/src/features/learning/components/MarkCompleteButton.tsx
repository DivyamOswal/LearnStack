import { Button } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMarkLessonComplete } from '../learningApi';

interface MarkCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

const MarkCompleteButton = ({ lessonId, isCompleted }: MarkCompleteButtonProps) => {
  const markComplete = useMarkLessonComplete();

  if (isCompleted) {
    return (
      <Button startIcon={<CheckCircleIcon />} disabled variant="outlined" color="primary">
        Completed
      </Button>
    );
  }

  return (
    <Button
      startIcon={<CheckCircleOutlinedIcon />}
      variant="contained"
      disableElevation
      onClick={() => markComplete.mutate(lessonId)}
      disabled={markComplete.isPending}
    >
      {markComplete.isPending ? 'Saving...' : 'Mark as complete'}
    </Button>
  );
};

export default MarkCompleteButton;