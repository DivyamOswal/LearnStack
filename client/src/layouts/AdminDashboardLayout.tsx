import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

import Sidebar, { SidebarNavItem } from '@/components/layout/Sidebar';
import { ROUTES } from '@/routes/routePaths';

const navItems: SidebarNavItem[] = [
  { label: 'Overview', path: ROUTES.ADMIN.OVERVIEW, icon: DashboardOutlinedIcon },
  { label: 'Users', path: ROUTES.ADMIN.USERS, icon: PeopleOutlinedIcon },
  { label: 'Courses', path: ROUTES.ADMIN.COURSES, icon: SchoolOutlinedIcon },
  { label: 'Categories', path: ROUTES.ADMIN.CATEGORIES, icon: CategoryOutlinedIcon },
  { label: 'Quizzes', path: ROUTES.ADMIN.QUIZZES, icon: QuizOutlinedIcon },
  { label: 'Coupons', path: ROUTES.ADMIN.COUPONS, icon: LocalOfferOutlinedIcon },
  { label: 'Moderation', path: ROUTES.ADMIN.MODERATION, icon: FlagOutlinedIcon },
  { label: 'Blog', path: ROUTES.ADMIN.BLOG, icon: ArticleOutlinedIcon },
  { label: 'Broadcast', path: '/admin/notifications', icon: CampaignOutlinedIcon },
];

const AdminDashboardLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #1E293B 0%, #0F172A 45%, #020617 100%)',
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
            bgcolor: '#0F172A',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,.45)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Sidebar items={navItems} />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            minHeight: 'calc(100vh - 32px)',
            bgcolor: '#111827',
            borderRadius: 5,
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

export default AdminDashboardLayout;