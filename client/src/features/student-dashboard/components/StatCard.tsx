import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  label: string;
  value: number;
  icon: SvgIconComponent;
  formatValue?: (value: number) => string;
}

const AnimatedNumber = ({ value, formatValue }: { value: number; formatValue?: (v: number) => string }) => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{formatValue ? formatValue(displayValue) : displayValue}</>;
};

const StatCard = ({ label, value, icon: Icon, formatValue }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="flex items-center gap-4 p-5 rounded-lg border"
    style={{ borderColor: 'inherit' }}
  >
    <motion.div
      whileHover={{ rotate: [0, -6, 6, 0] }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center rounded-md shrink-0"
      style={{ width: 44, height: 44, backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
    >
      <Icon sx={{ color: 'primary.main', fontSize: 22 }} />
    </motion.div>
    <div>
      <Typography className="font-mono-ui" sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
        <AnimatedNumber value={value} formatValue={formatValue} />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </div>
  </motion.div>
);

export default StatCard;