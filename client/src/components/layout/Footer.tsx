import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';
import { ROUTES } from '@/routes/routePaths';

const footerLinks = {
  learn: [
    { label: 'Courses', path: ROUTES.COURSES },
    { label: 'Playground', path: ROUTES.PLAYGROUND },
    { label: 'Blog', path: ROUTES.BLOG },
  ],
  company: [
    { label: 'About', path: '/about' },
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
  ],
};

const Footer = () => {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Logo column LearnStack spans full width on mobile, one column on larger screens */}
          <div className="col-span-2 sm:col-span-2">
            <div className="flex items-baseline gap-0.5 font-mono-ui">
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>$</Typography>
              <Typography component="span" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}>
                learnstack
              </Typography>
            </div>
            <Typography variant="body2" color="text.secondary" className="mt-3 max-w-xs">
              Learn to build things, one lesson at a time.
            </Typography>
          </div>

          <div>
            <Typography variant="overline" color="text.secondary">learn</Typography>
            <div className="flex flex-col gap-2 mt-3">
              {footerLinks.learn.map((link) => (
                <RouterLink
                  key={link.path}
                  to={link.path}
                  className="text-sm no-underline text-inherit hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </RouterLink>
              ))}
            </div>
          </div>

          <div>
            <Typography variant="overline" color="text.secondary">company</Typography>
            <div className="flex flex-col gap-2 mt-3">
              {footerLinks.company.map((link) => (
                <RouterLink
                  key={link.path}
                  to={link.path}
                  className="text-sm no-underline text-inherit hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </RouterLink>
              ))}
            </div>
          </div>
        </div>

        <Divider sx={{ my: { xs: 4, md: 6 } }} />

        <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <Typography variant="caption" color="text.secondary" className="font-mono-ui">
            © {new Date().getFullYear()} learnstack. all rights reserved.
          </Typography>
        </div>
      </div>
    </Box>
  );
};

export default Footer;