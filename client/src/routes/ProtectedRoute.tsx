import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAppSelector } from '@/app/hooks';
import { ROUTES } from './routePaths';

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isInitializing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // preserve the page they were trying to reach, so login can redirect back after success
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;