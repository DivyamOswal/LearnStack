import { Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
    <Typography className="font-mono-ui" color="text.secondary" sx={{ fontSize: '2rem' }}>
      ¯\_(ツ)_/¯
    </Typography>
    <Typography variant="h6">{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {description}
      </Typography>
    )}
  </div>
);

export default EmptyState;