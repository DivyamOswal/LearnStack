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
      <Button
        startIcon={<CheckCircleIcon />}
        disabled
        variant="outlined"
        sx={{
          textTransform: 'none',
          borderRadius: 2,
          fontWeight: 600,
          color: '#4ade80',
          borderColor: 'rgba(34,197,94,0.35)',
          bgcolor: 'rgba(34,197,94,0.08)',
          '&.Mui-disabled': {
            color: '#4ade80',
            borderColor: 'rgba(34,197,94,0.35)',
          },
        }}
      >
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
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
        px: 3,
        boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
      }}
    >
      {markComplete.isPending ? 'Saving...' : 'Mark as complete'}
    </Button>
  );
};

export default MarkCompleteButton;