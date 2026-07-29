import { useState } from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

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

const roleIcons = {
  student: DashboardOutlinedIcon,
  admin: AdminPanelSettingsOutlinedIcon,
};

const DashboardPreviewToggle = () => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const RoleIcon = roleIcons[role];

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'inherit' }}>
      {/* Custom tab bar — replaces MUI's default underline with a sliding
          filled indicator, so it reads as a real toggle rather than a link tab */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', p: 0.75, gap: 0.5 }}>
        {(['student', 'admin'] as const).map((r) => {
          const Icon = roleIcons[r];
          const isActive = role === r;
          return (
            <Box key={r} sx={{ position: 'relative', flex: 1 }}>
              {isActive && (
                <motion.div
                  layoutId="role-toggle-bg"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 6,
                    backgroundColor: 'var(--mui-palette-action-hover, #1c2128)',
                  }}
                />
              )}
              <Box
                component="button"
                onClick={() => setRole(r)}
                className="font-mono-ui"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  width: '100%',
                  py: 1,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <Icon fontSize="small" />
                {r}
              </Box>
            </Box>
          );
        })}
      </Box>

      <div className="p-6 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header row — icon crossfades with the role switch */}
            <div className="flex items-center gap-2 mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex' }}
                >
                  <RoleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </motion.div>
              </AnimatePresence>
              <Typography className="font-mono-ui" variant="body2" color="text.secondary">
                {role === 'student' ? 'what learners get' : 'what admins get'}
              </Typography>
            </div>

            <ul className="flex flex-col gap-1" style={{ listStyle: 'none' }}>
              {content[role].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-2.5 p-2 rounded-md"
                  style={{ transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mui-palette-action-hover, #1c2128)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.2, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardPreviewToggle;