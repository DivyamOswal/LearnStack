import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import StatCard from '@/features/student-dashboard/components/StatCard';
import { formatCurrency } from '@/utils/formatCurrency';
import { DashboardStats } from '../../adminDashboard.types';
import { Typography } from '@mui/material';

const DashboardStatsCards = ({ stats }: { stats: DashboardStats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Students" value={stats.totalStudents} icon={PeopleOutlinedIcon} />
      <StatCard label="Published courses" value={stats.publishedCourses} icon={SchoolOutlinedIcon} />
      <StatCard label="Total enrollments" value={stats.totalEnrollments} icon={ShoppingCartOutlinedIcon} />
      <div className="flex items-center gap-4 p-5 rounded-lg border" style={{ borderColor: 'inherit' }}>
        <div
          className="flex items-center justify-center rounded-md shrink-0"
          style={{ width: 44, height: 44, backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
        >
          <PaidOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        </div>
        <div>
          <Typography className="font-mono-ui" sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
            {formatCurrency(stats.totalRevenue)}
          </Typography>
          <Typography variant="body2" color="text.secondary">Total revenue</Typography>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCards;