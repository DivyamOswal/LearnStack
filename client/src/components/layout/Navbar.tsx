import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleThemeMode } from '@/app/uiSlice';
// import { useLogout } from '@/features/auth/authApi';
import { ROUTES } from '@/routes/routePaths';

const navLinks = [
  { label: 'courses', path: ROUTES.COURSES },
  { label: 'playground', path: ROUTES.PLAYGROUND },
  { label: 'blog', path: ROUTES.BLOG },
];

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const logoutMutation = useLogout();

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
        }}
      >
        <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Logo LearnStack terminal-prompt signature: reads like a shell prompt, not a generic wordmark */}
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
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <Typography component="span" className="font-mono-ui" sx={{ color: 'primary.main', fontWeight: 600 }}>
              $
            </Typography>
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

          {/* Desktop nav links */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 6, flexGrow: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  className="font-mono-ui"
                  sx={{ color: 'text.secondary', fontSize: '0.9rem', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}

          {/* Right side: theme toggle + auth state */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => dispatch(toggleThemeMode())} size="small" aria-label="Toggle dark mode">
              {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            {!isMobile && isAuthenticated && user && (
              <>
                <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} size="small">
                  <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
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
              <Stack direction="row" spacing={1}>
                <Button component={RouterLink} to={ROUTES.LOGIN} sx={{ color: 'text.primary' }}>
                  Log in
                </Button>
                <Button component={RouterLink} to={ROUTES.REGISTER} variant="contained" disableElevation>
                  Get started
                </Button>
              </Stack>
            )}

            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={0.5} sx={{ px: 2 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={RouterLink}
              to={link.path}
              className="font-mono-ui"
              onClick={() => setMobileOpen(false)}
              sx={{ justifyContent: 'flex-start', color: 'text.primary', fontSize: '0.95rem' }}
            >
              {link.label}
            </Button>
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