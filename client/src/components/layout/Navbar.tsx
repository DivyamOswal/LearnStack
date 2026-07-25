import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import NotificationBell from '@/features/notifications/components/NotificationBell';
import SearchBar from '@/features/search/components/SearchBar';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleThemeMode } from '@/app/uiSlice';
import { useLogout } from '@/features/auth/authApi';
import { ROUTES } from '@/routes/routePaths';

const navLinks = [
  { label: 'courses', path: ROUTES.COURSES },
  { label: 'playground', path: ROUTES.PLAYGROUND },
  { label: 'blog', path: ROUTES.BLOG },
];

const useScrolled = (threshold = 8) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();
  const scrolled = useScrolled();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setUserMenuAnchor(null);
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.HOME),
    });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: scrolled ? '0 4px 20px -8px rgba(0,0,0,0.35)' : 'none',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Logo -terminal-prompt signature: reads like a shell prompt, not a generic wordmark */}
          <motion.div whileHover="hover" initial="idle" style={{ flexGrow: isMobile ? 1 : 0 }}>
            <Box
              component={RouterLink}
              to={ROUTES.HOME}
              className="font-mono-ui"
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 0.5,
                textDecoration: 'none',
                color: 'text.primary',
              }}
            >
              <motion.span
                variants={{ idle: { rotate: 0 }, hover: { rotate: [0, -8, 8, 0] } }}
                transition={{ duration: 0.4 }}
                style={{ display: 'inline-block' }}
              >
                <Typography component="span" className="font-mono-ui" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  $
                </Typography>
              </motion.span>
              <Typography component="span" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1.15rem' }}>
                learnstack
              </Typography>
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 18,
                  bgcolor: 'primary.main',
                  ml: 0.5,
                  animation: 'blink 1.1s steps(1) infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 },
                  },
                }}
              />
            </Box>
          </motion.div>

          {/* Desktop nav links with active-route indicator */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 6, flexGrow: 1 }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Box key={link.path} sx={{ position: 'relative' }}>
                    <Button
                      component={RouterLink}
                      to={link.path}
                      className="font-mono-ui"
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontSize: '0.9rem',
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                      }}
                    >
                      {link.label}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 12,
                          right: 12,
                          height: 2,
                          borderRadius: 2,
                          backgroundColor: 'var(--mui-palette-primary-main, #2DD4BF)',
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Right side: search, notifications, theme toggle, auth state */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <SearchBar />
            {isAuthenticated && <NotificationBell />}

            <IconButton
              onClick={() => dispatch(toggleThemeMode())}
              size="small"
              aria-label="Toggle dark mode"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={themeMode}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </motion.span>
              </AnimatePresence>
            </IconButton>

            {!isMobile && isAuthenticated && user && (
              <>
                <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                    <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </motion.div>
                </IconButton>
                <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}>
                  <MenuItem
                    component={RouterLink}
                    to={user.role === 'ADMIN' ? ROUTES.ADMIN.OVERVIEW : ROUTES.DASHBOARD}
                    onClick={() => setUserMenuAnchor(null)}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem component={RouterLink} to={ROUTES.PROFILE} onClick={() => setUserMenuAnchor(null)}>
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </>
            )}

            {!isMobile && !isAuthenticated && (
              <Stack direction="row" spacing={1} sx={{ ml: 0.5 }}>
                <Button component={RouterLink} to={ROUTES.LOGIN} sx={{ color: 'text.primary' }}>
                  Log in
                </Button>
                <Button
                  component={RouterLink}
                  to={ROUTES.REGISTER}
                  variant="contained"
                  disableElevation
                  sx={{
                    transition: 'transform 0.15s ease',
                    '&:hover': { transform: 'translateY(-1px)' },
                  }}
                >
                  Get started
                </Button>
              </Stack>
            )}

            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} aria-label="Open menu" sx={{ ml: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer -staggered link entrance */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={0.5} sx={{ px: 2 }}>
          {navLinks.map((link, i) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: mobileOpen ? 1 : 0, x: mobileOpen ? 0 : 16 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <Button
                component={RouterLink}
                to={link.path}
                className="font-mono-ui"
                onClick={() => setMobileOpen(false)}
                sx={{
                  justifyContent: 'flex-start',
                  color: location.pathname === link.path ? 'primary.main' : 'text.primary',
                  fontSize: '0.95rem',
                  width: '100%',
                }}
              >
                {link.label}
              </Button>
            </motion.div>
          ))}
          <Divider sx={{ my: 1 }} />
          {isAuthenticated && user ? (
            <>
              <Button
                component={RouterLink}
                to={user.role === 'ADMIN' ? ROUTES.ADMIN.OVERVIEW : ROUTES.DASHBOARD}
                onClick={() => setMobileOpen(false)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to={ROUTES.PROFILE}
                onClick={() => setMobileOpen(false)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Profile
              </Button>
              <Button onClick={handleLogout} sx={{ justifyContent: 'flex-start', color: 'error.main' }}>
                Log out
              </Button>
            </>
          ) : (
            <Stack spacing={1}>
              <Button component={RouterLink} to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} variant="outlined" fullWidth>
                Log in
              </Button>
              <Button component={RouterLink} to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} variant="contained" disableElevation fullWidth>
                Get started
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default Navbar;