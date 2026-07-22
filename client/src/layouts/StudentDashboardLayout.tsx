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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar items={navItems} />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentDashboardLayout;