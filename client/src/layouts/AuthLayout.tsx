import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;