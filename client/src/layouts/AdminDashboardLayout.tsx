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
import Sidebar, { SidebarNavItem } from '@/components/layout/Sidebar';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar items={navItems} />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;