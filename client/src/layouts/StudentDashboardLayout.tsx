import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

import Sidebar, { SidebarNavItem } from '@/components/layout/Sidebar';
import { ROUTES } from '@/routes/routePaths';

const navItems: SidebarNavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: DashboardOutlinedIcon },
  { label: 'My Courses', path: ROUTES.COURSES, icon: SchoolOutlinedIcon },
  { label: 'Certificates', path: '/dashboard/certificates', icon: WorkspacePremiumOutlinedIcon },
  { label: 'Bookmarks', path: '/dashboard/bookmarks', icon: BookmarkBorderIcon },
  { label: 'Profile', path: ROUTES.PROFILE, icon: PersonOutlinedIcon },
];

const StudentDashboardLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#0F172A',
        background:
          'radial-gradient(circle at top right, #1E293B 0%, #0F172A 45%, #020617 100%)',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: 4,
            bgcolor: 'rgba(15,23,42,.95)',
            border: '1px solid rgba(255,255,255,.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,.45)',
          }}
        >
          <Sidebar items={navItems} />
        </Box>
      </Box>

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <Box
          sx={{
            minHeight: 'calc(100vh - 32px)',
            borderRadius: 5,
            bgcolor: '#111827',
            border: '1px solid rgba(255,255,255,.08)',
            boxShadow: '0 15px 60px rgba(0,0,0,.45)',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboardLayout;