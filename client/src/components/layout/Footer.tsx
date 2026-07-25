import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ROUTES } from '@/routes/routePaths';

const footerLinks = {
  product: [
    { label: 'Browse courses', path: ROUTES.COURSES },
    { label: 'Code playground', path: ROUTES.PLAYGROUND },
    { label: 'Blog', path: ROUTES.BLOG },
  ],
  account: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Profile & settings', path: ROUTES.PROFILE },
    { label: 'Create account', path: ROUTES.REGISTER },
  ],
  company: [
    { label: 'About', path: '/about' },
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
  ],
};

const useLiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};

const FooterLinkGroup = ({ title, links }: { title: string; links: { label: string; path: string }[] }) => (
  <div>
    <Typography variant="overline" color="text.secondary" className="font-mono-ui">
      {title}
    </Typography>
    <div className="flex flex-col gap-2 mt-3">
      {links.map((link) => (
        <motion.div key={link.path} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
          <RouterLink
            to={link.path}
            className="text-sm no-underline transition-colors"
            style={{ color: 'inherit' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--mui-palette-primary-main, #2DD4BF)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
          >
            {link.label}
          </RouterLink>
        </motion.div>
      ))}
    </div>
  </div>
);

const Footer = () => {
  const time = useLiveClock();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          {/* Logo + tagline -spans full width on mobile, two columns on larger screens */}
          <div className="col-span-2 sm:col-span-2 flex flex-col gap-4">
            <div className="flex items-baseline gap-0.5 font-mono-ui">
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>$</Typography>
              <Typography component="span" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}>
                learnstack
              </Typography>
            </div>
            <Typography variant="body2" color="text.secondary" className="max-w-xs">
              Learn to build things, one lesson at a time. Structured courses, live code, and certificates that mean something.
            </Typography>

            {/* Live clock -genuinely computed client-side, not decorative */}
            <div className="flex items-center gap-2 mt-1">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--mui-palette-primary-main, #2DD4BF)' }}
              />
              <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                {time.toLocaleTimeString('en-US', { hour12: false })} local time
              </Typography>
            </div>
          </div>

          <FooterLinkGroup title="product" links={footerLinks.product} />
          <FooterLinkGroup title="account" links={footerLinks.account} />
          <FooterLinkGroup title="company" links={footerLinks.company} />
        </div>

        <Divider sx={{ my: { xs: 5, md: 7 } }} />

        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <Typography variant="caption" color="text.secondary" className="font-mono-ui">
            © {new Date().getFullYear()} learnstack -built with react, node, and postgres.
          </Typography>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={scrollToTop}
              size="small"
              aria-label="Back to top"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
              }}
            >
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </div>
      </div>
    </Box>
  );
};

export default Footer;