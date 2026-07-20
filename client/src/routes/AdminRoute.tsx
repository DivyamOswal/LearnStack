import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAppSelector } from '@/app/hooks';
import { ROUTES } from './routePaths';

const AdminRoute = () => {
  const { user, isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;