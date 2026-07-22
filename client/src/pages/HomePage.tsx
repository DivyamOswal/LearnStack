import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ROUTES } from '@/routes/routePaths';

const categories = ['javascript', 'react', 'node.js', 'postgresql', 'system-design', 'dsa'];

const pipeline = [
  { step: 'course', desc: 'Pick a path LearnStack from fundamentals to system design.' },
  { step: 'chapter', desc: 'Structured units, ordered so nothing assumes what you haven\'t learned yet.' },
  { step: 'lesson', desc: 'Video, article, or live code LearnStack whichever teaches the concept best.' },
  { step: 'quiz', desc: 'Prove it before moving on. Negative marking keeps guessing honest.' },
  { step: 'certificate', desc: 'A verifiable credential, not just a checkbox.' },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--mui-palette-divider, #30363D)' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <div className="flex flex-col items-start gap-6 max-w-3xl">
            <Chip
              label="$ init --path=fullstack"
              size="small"
              className="font-mono-ui"
              sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                lineHeight: 1.1,
              }}
            >
              Learn to build things,
              <br />
              not just watch tutorials.
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 560 }}>
              Structured courses, a live code playground, timed quizzes, and real certificates LearnStack
              built for people who learn by shipping.
            </Typography>

            <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto">
              <Button
                component={RouterLink}
                to={ROUTES.COURSES}
                variant="contained"
                disableElevation
                size="large"
                endIcon={<ArrowForwardIcon />}
                className="w-full sm:w-auto"
              >
                Browse courses
              </Button>
              <Button
                component={RouterLink}
                to={ROUTES.PLAYGROUND}
                variant="outlined"
                size="large"
                className="w-full sm:w-auto font-mono-ui"
              >
                Try the playground →
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  className="font-mono-ui"
                  sx={{ bgcolor: 'action.hover', color: 'text.secondary' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline section LearnStack Course → Chapter → Lesson → Quiz → Certificate, a real sequence */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <Typography variant="overline" color="primary.main">
          $ course --structure
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, mb: { xs: 4, md: 6 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
          Every course follows the same pipeline.
        </Typography>

        <div className="flex flex-col divide-y" style={{ borderColor: 'inherit' }}>
          {pipeline.map((item, index) => (
            <div
              key={item.step}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
            >
              <Typography
                className="font-mono-ui"
                sx={{ color: 'text.secondary', minWidth: { sm: 48 }, fontSize: '0.9rem' }}
              >
                {String(index + 1).padStart(2, '0')}
              </Typography>
              <Typography
                variant="h5"
                sx={{ minWidth: { sm: 220 }, textTransform: 'lowercase', color: 'primary.main' }}
              >
                {item.step}
              </Typography>
              <Typography color="text.secondary">{item.desc}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-20 text-center flex flex-col items-center gap-6">
          <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Ready to start?
          </Typography>
          <Button
            component={RouterLink}
            to={ROUTES.REGISTER}
            variant="contained"
            disableElevation
            size="large"
          >
            Create your free account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;