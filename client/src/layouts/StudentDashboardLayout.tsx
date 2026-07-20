import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const StudentDashboardLayout = () => {
  return (
    <Box display="flex">
      {/* Sidebar goes here once built */}
      <Box flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentDashboardLayout;