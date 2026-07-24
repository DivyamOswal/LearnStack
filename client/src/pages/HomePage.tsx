import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { ROUTES } from '@/routes/routePaths';
import TerminalHero from '@/features/home/components/TerminalHero';
import RevealSection from '@/features/home/components/RevealSection';
import DashboardPreviewToggle from '@/features/home/components/DashboardPreviewToggle';

const categories = [
  'javascript', 'typescript', 'react', 'node.js', 'express.js',
  'postgresql', 'prisma', 'docker', 'aws', 'system-design', 'dsa',
];

const pipeline = [
  { step: 'course', desc: 'Pick a path from fundamentals to system design.' },
  { step: 'chapter', desc: "Structured units, ordered so nothing assumes what you haven't learned yet." },
  { step: 'lesson', desc: 'Video, article, markdown, or live code whichever teaches the concept best.' },
  { step: 'quiz', desc: 'Prove it before moving on. Negative marking keeps guessing honest.' },
  { step: 'certificate', desc: 'A QR-verifiable credential, not just a checkbox.' },
];

const features = [
  { icon: SchoolOutlinedIcon, title: 'Structured curriculum', desc: 'Every course is broken into chapters, lessons, and topics a real syllabus, not a random playlist.' },
  { icon: CodeOutlinedIcon, title: 'Live code playground', desc: 'Write HTML, CSS, and JavaScript in an in-browser editor and see the output update instantly, sandboxed and safe.' },
  { icon: QuizOutlinedIcon, title: 'Timed quizzes', desc: 'MCQ, multiple-answer, and true/false questions with optional negative marking and a live leaderboard per quiz.' },
  { icon: WorkspacePremiumOutlinedIcon, title: 'Verified certificates', desc: 'Finish every lesson in a course and get a certificate with a unique code and QR verification page anyone can check.' },
  { icon: TrendingUpOutlinedIcon, title: 'Progress you can see', desc: 'Lesson-by-lesson completion tracking, a continue-where-you-left-off view, and a dashboard that actually reflects your work.' },
  { icon: ForumOutlinedIcon, title: 'Reviews & discussion', desc: 'Rate and review courses you have completed, and ask questions directly on any lesson with nested replies.' },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 md:px-8 md:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-start gap-6"
            >
              <Chip
                label="$ init --path=fullstack"
                size="small"
                className="font-mono-ui"
                sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
              />

              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                Learn to build things,
                <br />
                not just watch tutorials.
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520 }}>
                Structured courses, a live code playground, timed quizzes, and real certificates —
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
                  sx={{
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px -8px var(--mui-palette-primary-main, #2DD4BF)' },
                  }}
                >
                  Browse courses
                </Button>
                <Button
                  component={RouterLink}
                  to={ROUTES.PLAYGROUND}
                  variant="outlined"
                  size="large"
                  className="w-full sm:w-auto font-mono-ui"
                  sx={{ transition: 'transform 0.15s ease', '&:hover': { transform: 'translateY(-2px)' } }}
                >
                  Try the playground →
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: 0.3 + i * 0.03 }}
                  >
                    <Chip
                      label={cat}
                      size="small"
                      className="font-mono-ui"
                      sx={{
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                        transition: 'all 0.15s ease',
                        cursor: 'default',
                        '&:hover': { color: 'primary.main', bgcolor: 'transparent', borderColor: 'primary.main' },
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center lg:justify-end"
            >
              <TerminalHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <RevealSection>
          <Typography variant="overline" color="primary.main">$ features --list</Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: { xs: 4, md: 6 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Everything you need to actually learn.
          </Typography>
        </RevealSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <RevealSection key={title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'var(--mui-palette-primary-main, #2DD4BF)' }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3 p-5 rounded-lg border h-full"
                style={{ borderColor: 'inherit' }}
              >
                <div
                  className="flex items-center justify-center rounded-md shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
                >
                  <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
                </div>
                <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{desc}</Typography>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Pipeline section */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <RevealSection>
            <Typography variant="overline" color="primary.main">$ course --structure</Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: { xs: 4, md: 6 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Every course follows the same pipeline.
            </Typography>
          </RevealSection>

          <div className="flex flex-col divide-y" style={{ borderColor: 'inherit' }}>
            {pipeline.map((item, index) => (
              <RevealSection key={item.step} delay={index * 0.08}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <Typography className="font-mono-ui" sx={{ color: 'text.secondary', minWidth: { sm: 48 }, fontSize: '0.9rem' }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Typography variant="h5" sx={{ minWidth: { sm: 220 }, textTransform: 'lowercase', color: 'primary.main' }}>
                    {item.step}
                  </Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive dashboard preview */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <RevealSection>
            <Typography variant="overline" color="primary.main">$ whoami --role</Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: { xs: 4, md: 6 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Built for learners and instructors alike.
            </Typography>
          </RevealSection>

          <RevealSection delay={0.1}>
            <DashboardPreviewToggle />
          </RevealSection>
        </div>
      </section>

      {/* Closing detail bar */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: DarkModeOutlinedIcon, label: 'dark mode built in' },
            { icon: WorkspacePremiumOutlinedIcon, label: 'certificates are publicly verifiable' },
            { icon: CodeOutlinedIcon, label: 'playground runs sandboxed, client-side' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" className="font-mono-ui">{label}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-20 text-center flex flex-col items-center gap-6">
          <RevealSection>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Ready to start?
            </Typography>
          </RevealSection>
          <RevealSection delay={0.1}>
            <Button
              component={RouterLink}
              to={ROUTES.REGISTER}
              variant="contained"
              disableElevation
              size="large"
              sx={{
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px -8px var(--mui-palette-primary-main, #2DD4BF)' },
              }}
            >
              Create your free account
            </Button>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;