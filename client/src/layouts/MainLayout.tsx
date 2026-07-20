import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '@/components/layout/Navbar';

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      {/* Footer goes here next */}
    </Box>
  );
};

export default MainLayout;