import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { motion } from 'framer-motion';
import StatCard from '@/features/student-dashboard/components/StatCard';
import { formatCurrency } from '@/utils/formatCurrency';
import { DashboardStats } from '../../adminDashboard.types';

const DashboardStatsCards = ({ stats }: { stats: DashboardStats }) => {
  const cards = [
    { label: 'Students', value: stats.totalStudents, icon: PeopleOutlinedIcon },
    { label: 'Published courses', value: stats.publishedCourses, icon: SchoolOutlinedIcon },
    { label: 'Total enrollments', value: stats.totalEnrollments, icon: ShoppingCartOutlinedIcon },
    { label: 'Total revenue', value: stats.totalRevenue, icon: PaidOutlinedIcon, formatValue: formatCurrency },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStatsCards;