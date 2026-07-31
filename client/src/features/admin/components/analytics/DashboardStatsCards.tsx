import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatCurrency';
import { DashboardStats } from '../../adminDashboard.types';

type CardConfig = {
  label: string;
  value: number;
  icon: typeof PeopleOutlinedIcon;
  formatValue?: (n: number) => string;
};

// Counts up from 0 to the target value — makes the numbers feel "alive"
// on load rather than just appearing, without being a distracting animation.
const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const StatCard = ({ label, value, icon: Icon, formatValue }: CardConfig) => {
  const animatedValue = useCountUp(value);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        p: 3,
        pt: 2.5,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Accent bar — the one signature detail carried across every card, single color */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: 'primary.main',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1.4 }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 20, color: 'primary.main' }} />
        </Box>
      </Box>

      <Typography
        className="font-mono-ui"
        sx={{
          fontSize: '1.9rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatValue ? formatValue(animatedValue) : animatedValue.toLocaleString()}
      </Typography>
    </Paper>
  );
};

const DashboardStatsCards = ({ stats }: { stats: DashboardStats }) => {
  const cards: CardConfig[] = [
    { label: 'Students', value: stats.totalStudents, icon: PeopleOutlinedIcon },
    { label: 'Published courses', value: stats.publishedCourses, icon: SchoolOutlinedIcon },
    { label: 'Total enrollments', value: stats.totalEnrollments, icon: ShoppingCartOutlinedIcon },
    {
      label: 'Total revenue',
      value: stats.totalRevenue,
      icon: PaidOutlinedIcon,
      formatValue: formatCurrency,
    },
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