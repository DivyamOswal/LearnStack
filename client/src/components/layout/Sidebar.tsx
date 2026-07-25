import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { SvgIconComponent } from '@mui/icons-material';

export interface SidebarNavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

const Sidebar = ({ items }: { items: SidebarNavItem[] }) => {
  const location = useLocation();

  return (
    <nav
      className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r md:sticky md:top-0 md:h-screen"
      style={{ borderColor: 'inherit' }}
    >
      <div className="flex flex-col gap-1 p-4">
        {items.map((item, i) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              whileHover={{ x: isActive ? 0 : 3 }}
              style={{ position: 'relative' }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    backgroundColor: 'var(--mui-palette-action-hover, #1c2128)',
                  }}
                />
              )}

              <Box
                component={RouterLink}
                to={item.path}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {/* Left accent bar -appears only on the active item, slides between items */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    style={{
                      position: 'absolute',
                      left: -16,
                      top: 4,
                      bottom: 4,
                      width: 3,
                      borderRadius: 3,
                      backgroundColor: 'var(--mui-palette-primary-main, #2DD4BF)',
                    }}
                  />
                )}

                <Icon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;