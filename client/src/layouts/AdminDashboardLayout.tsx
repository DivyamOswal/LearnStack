import { Outlet, useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Button, Divider } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import Sidebar, { SidebarNavItem } from '@/components/layout/Sidebar';
import { ROUTES } from '@/routes/routePaths';
import { useLogout } from '@/features/auth/authApi';

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
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.HOME),
    });
  };

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
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 4,
            bgcolor: '#0F172A',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,.45)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Sidebar items={navItems} />

          <Divider sx={{ borderColor: 'rgba(255,255,255,.08)', mx: 2 }} />

          <Box sx={{ p: 2 }}>
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              fullWidth
              startIcon={<LogoutOutlinedIcon fontSize="small" />}
              sx={{
                justifyContent: 'flex-start',
                color: 'error.main',
                fontSize: '0.85rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(244,67,54,0.08)' },
              }}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </Button>
          </Box>
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
            position: 'relative',
            minHeight: 'calc(100vh - 32px)',
            bgcolor: '#111827',
            borderRadius: 5,
            border: '1px solid rgba(255,255,255,.08)',
            boxShadow: '0 15px 60px rgba(0,0,0,.45)',
            overflow: 'hidden',
          }}
        >
          {/* Back button */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              p: 2,
              bgcolor: 'rgba(17, 24, 39, 0.85)',
              backdropFilter: 'blur(8px)',
              borderBottom: '1px solid rgba(255,255,255,.06)',
            }}
          >
            <Tooltip title="Go back">
              <IconButton
                onClick={() => navigate(-1)}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,.85)',
                  bgcolor: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,.12)',
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;