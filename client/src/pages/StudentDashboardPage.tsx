import { Typography, CircularProgress } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAppSelector } from '@/app/hooks';
import { useDashboardSummary } from '@/features/student-dashboard/studentDashboardApi';
import StatCard from '@/features/student-dashboard/components/StatCard';
import PurchasedCoursesGrid from '@/features/student-dashboard/components/PurchasedCoursesGrid';

const StudentDashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useDashboardSummary();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ whoami
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Welcome back, {user?.name.split(' ')[0]}
      </Typography>

      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-3">
        <StatCard label="Courses purchased" value={data.stats.totalCoursesPurchased} icon={SchoolOutlinedIcon} />
        <StatCard label="Certificates earned" value={data.stats.totalCertificates} icon={WorkspacePremiumOutlinedIcon} />
        <StatCard label="Bookmarked courses" value={data.stats.totalBookmarks} icon={BookmarkBorderIcon} />
      </div>

      <Typography variant="h5" sx={{ mb: 4 }}>
        Your courses
      </Typography>
      <PurchasedCoursesGrid orders={data.purchasedCourses} />
    </div>
  );
};

export default StudentDashboardPage;