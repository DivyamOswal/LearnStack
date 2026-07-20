import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const AdminDashboardLayout = () => {
  return (
    <Box display="flex">
      {/* Admin sidebar goes here once built */}
      <Box flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;