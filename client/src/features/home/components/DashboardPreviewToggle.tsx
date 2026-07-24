import { useState } from 'react';
import { Typography, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

const content = {
  student: [
    'Purchased courses and continue-learning shortcuts',
    'Certificates earned, with download and QR verification',
    'Bookmarked courses for later',
    'Quiz history and leaderboard standing',
    'Profile, avatar, and social links',
  ],
  admin: [
    'Full course, chapter, and lesson builder',
    'Quiz and question builder with per-type validation',
    'Revenue and enrollment analytics, with charts',
    'User management, categories, and coupons',
    'Comment moderation and reported-content review',
  ],
};

const DashboardPreviewToggle = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'inherit' }}>
      <Tabs
        value={role}
        onChange={(_, value) => setRole(value)}
        variant="fullWidth"
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab
          value="student"
          icon={<DashboardOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="student"
          className="font-mono-ui"
        />
        <Tab
          value="admin"
          icon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="admin"
          className="font-mono-ui"
        />
      </Tabs>

      <div className="p-6 min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.ul
            key={role}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3"
            style={{ listStyle: 'none' }}
          >
            {content[role].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <Typography className="font-mono-ui" color="primary.main" sx={{ fontSize: '0.85rem', mt: 0.3 }}>
                  ›
                </Typography>
                <Typography variant="body2" color="text.secondary">{item}</Typography>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPreviewToggle;