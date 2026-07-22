import { Typography, CircularProgress } from '@mui/material';
import { useAdminDashboardStats, usePopularCoursesReport, useRevenueReport } from '@/features/admin/adminApi';
import DashboardStatsCards from '@/features/admin/components/analytics/DashboardStatsCards';
import RevenueChart from '@/features/admin/components/analytics/RevenueChart';
import PopularCoursesChart from '@/features/admin/components/analytics/PopularCoursesChart';

const AdminOverviewPage = () => {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: popularCourses, isLoading: popularLoading } = usePopularCoursesReport();
  const { data: revenue, isLoading: revenueLoading } = useRevenueReport();

  const isLoading = statsLoading || popularLoading || revenueLoading;

  if (isLoading || !stats || !popularCourses || !revenue) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --overview
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Platform overview
      </Typography>

      <div className="mb-10">
        <DashboardStatsCards stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenue} />
        <PopularCoursesChart data={popularCourses} />
      </div>
    </div>
  );
};

export default AdminOverviewPage;