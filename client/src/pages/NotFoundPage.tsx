import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { ROUTES } from '@/routes/routePaths';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 text-center" style={{ minHeight: '70vh' }}>
      <Typography className="font-mono-ui" color="primary.main" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
        The page you're looking for doesn't exist, or the URL might be wrong.
      </Typography>
      <div className="font-mono-ui text-sm mt-2 px-4 py-2 rounded-md" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
        $ cd / --force
      </div>
      <Button component={RouterLink} to={ROUTES.HOME} variant="contained" disableElevation sx={{ mt: 2 }}>
        Back to home
      </Button>
    </div>
  );
};

export default NotFoundPage;