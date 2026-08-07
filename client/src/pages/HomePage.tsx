import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Chip, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ROUTES } from '@/routes/routePaths';
import { useCourseList } from '@/features/courses/coursesApi';
import { useAppSelector } from '@/app/hooks';
import CourseCard from '@/features/courses/components/CourseCard';
import TerminalHero from '@/features/home/components/TerminalHero';
import RevealSection from '@/features/home/components/RevealSection';
import DashboardPreviewToggle from '@/features/home/components/DashboardPreviewToggle';

const categories = [
  'javascript', 'typescript', 'react', 'node.js', 'express.js',
  'postgresql', 'prisma', 'docker', 'aws', 'system-design', 'dsa',
];

const pipeline = [
  {
    step: 'course',
    desc: 'Pick a path from fundamentals to system design.',
    detail: 'Every course belongs to a category, so you can browse by stack instead of scrolling a flat catalog.',
  },
  {
    step: 'chapter',
    desc: "Structured units, ordered so nothing assumes what you haven't learned yet.",
    detail: 'Chapters are numbered and sequential you always know exactly where you are in a course.',
  },
  {
    step: 'lesson',
    desc: 'Video, article, markdown, or live code whichever teaches the concept best.',
    detail: 'Some lessons ship with a downloadable PDF alongside the main content for offline reference.',
  },
  {
    step: 'quiz',
    desc: 'Prove it before moving on. Negative marking keeps guessing honest.',
    detail: 'Single choice, multiple answer, and true/false formats, each scored and ranked on a per-quiz leaderboard.',
  },
  {
    step: 'certificate',
    desc: 'A QR-verifiable credential, not just a checkbox.',
    detail: 'Issued only once every lesson in the course is marked complete each one has a unique code anyone can verify, no login required.',
  },
];

const features = [
  { icon: SchoolOutlinedIcon, title: 'Structured curriculum', desc: 'Every course is broken into chapters, lessons, and topics a real syllabus, not a random playlist.' },
  { icon: CodeOutlinedIcon, title: 'Live code playground', desc: 'Write HTML, CSS, and JavaScript in an in-browser editor and see the output update instantly, sandboxed and safe.' },
  { icon: QuizOutlinedIcon, title: 'Timed quizzes', desc: 'MCQ, multiple-answer, and true/false questions with optional negative marking and a live leaderboard per quiz.' },
  { icon: WorkspacePremiumOutlinedIcon, title: 'Verified certificates', desc: 'Finish every lesson in a course and get a certificate with a unique code and QR verification page anyone can check.' },
  { icon: TrendingUpOutlinedIcon, title: 'Progress you can see', desc: 'Lesson-by-lesson completion tracking, a continue-where-you-left-off view, and a dashboard that actually reflects your work.' },
  { icon: ForumOutlinedIcon, title: 'Reviews & discussion', desc: 'Rate and review courses you have completed, and ask questions directly on any lesson with nested replies.' },
  { icon: BookmarkBorderOutlinedIcon, title: 'Bookmarks', desc: 'Save any course to come back to later track what you\'re planning to learn next without losing it in your history.' },
  { icon: EmojiEventsOutlinedIcon, title: 'Quiz leaderboards', desc: 'See how your score stacks up against everyone else who\'s taken the same quiz not just a pass/fail screen.' },
];

const faqs = [
  {
    q: 'Do I need any programming experience to start?',
    a: 'No. Courses are structured to start from fundamentals pick a beginner-level course in any category and the chapters are ordered so nothing assumes knowledge you haven\'t covered yet.',
  },
  {
    q: 'How does the certificate actually get issued?',
    a: 'Once you\'ve marked every lesson in a course complete, you can generate a certificate from your dashboard. It comes with a unique code and a QR code linking to a public verification page anyone can check it\'s real without needing an account.',
  },
  {
    q: 'Is the code playground actually safe to use?',
    a: 'Yes it runs entirely in a sandboxed iframe in your browser with scripts isolated from the rest of the site. Nothing you write there can access your account, cookies, or any other part of the platform.',
  },
  {
    q: 'What happens if I\'m not happy with a course I bought?',
    a: 'Refunds are handled by our team on a case-by-case basis through Stripe reach out to support with your order details and we\'ll take a look.',
  },
  {
    q: 'Does quiz negative marking apply if I skip a question?',
    a: 'No negative marking only applies when you select a wrong answer. Leaving a question blank never costs you points, only an incorrect attempt does.',
  },
  {
    q: 'How is the course catalog organized?',
    a: 'Every course belongs to a category like React, Docker, or System Design so you can browse by the stack you\'re working in instead of scrolling one long list.',
  },
  {
    q: 'Can I save a course to come back to later?',
    a: 'Yes each course has a bookmark button. Bookmarked courses show up in your dashboard so you don\'t lose track of what you were planning to start next.',
  },
  {
    q: 'Can I ask questions on a specific lesson?',
    a: 'Yes every lesson has its own comment thread with nested replies, so you can ask about that exact part of the material and get a response in context instead of a generic support ticket.',
  },
];

const HomePage = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Real, live count not a fabricated marketing number. limit:1 keeps the
  // request cheap since we only need the `total` field from the response.
  const { data: courseListData, isLoading: statsLoading } = useCourseList({ page: 1, limit: 1 });
  const { data: featuredData, isLoading: featuredLoading } = useCourseList({ page: 1, limit: 3 });

  const totalCourses = courseListData?.total ?? 0;

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

              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 560 }}>
                Structured courses, a live code playground, timed quizzes with leaderboards, and
                QR-verifiable certificates built for people who learn by shipping, not by
                collecting unfinished playlists.
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
                      component={RouterLink}
                      to={`${ROUTES.COURSES}?category=${cat}`}
                      clickable
                      label={cat}
                      size="small"
                      className="font-mono-ui"
                      sx={{
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                        transition: 'all 0.15s ease',
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

      {/* Live stats strip real numbers, not marketing copy */}
      <section className="border-b" style={{ borderColor: 'inherit', backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 font-mono-ui text-sm">
            {statsLoading ? (
              <CircularProgress size={16} />
            ) : (
              <span style={{ color: 'inherit' }}>
                <Typography component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  {totalCourses}
                </Typography>{' '}
                {totalCourses === 1 ? 'course' : 'courses'} live right now
              </span>
            )}
            <span style={{ color: 'inherit', opacity: 0.7 }}>·</span>
            <span style={{ opacity: 0.85 }}>free to browse, no card required</span>
            <span style={{ opacity: 0.7 }}>·</span>
            <span style={{ opacity: 0.85 }}>certificates verifiable by anyone</span>
            <span style={{ opacity: 0.7 }}>·</span>
            <span style={{ opacity: 0.85 }}>organized by category, not a flat list</span>
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

      {/* Browse by category real navigation, using the actual category taxonomy */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <RevealSection>
            <Typography variant="overline" color="primary.main">$ ls categories/</Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Browse by what you're building.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 600, mb: { xs: 4, md: 6 } }}>
              Every course is filed under a category so you can go straight to the stack you
              care about instead of scrolling a flat catalog.
            </Typography>
          </RevealSection>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <RevealSection key={cat} delay={i * 0.04}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
                  <RouterLink
                    to={`${ROUTES.COURSES}?category=${cat}`}
                    className="flex items-center gap-2 p-4 rounded-lg border no-underline"
                    style={{ borderColor: 'inherit', color: 'inherit' }}
                  >
                    <CategoryOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography className="font-mono-ui" sx={{ fontSize: '0.85rem', textTransform: 'lowercase' }}>
                      {cat}
                    </Typography>
                  </RouterLink>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses real, live data from the actual course catalog */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <RevealSection>
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <Typography variant="overline" color="primary.main">$ ls courses/ --featured</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                  Start with these.
                </Typography>
              </div>
              <Button
                component={RouterLink}
                to={ROUTES.COURSES}
                endIcon={<ArrowForwardIcon />}
                className="font-mono-ui"
              >
                view all
              </Button>
            </div>
          </RevealSection>

          {featuredLoading && (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          )}

          {!featuredLoading && featuredData && featuredData.courses.length === 0 && (
            <RevealSection>
              <div className="text-center py-12 border rounded-lg" style={{ borderColor: 'inherit' }}>
                <Typography color="text.secondary">
                  No courses published yet check back soon, or be one of the first to enroll once they go live.
                </Typography>
              </div>
            </RevealSection>
          )}

          {!featuredLoading && featuredData && featuredData.courses.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredData.courses.map((course, i) => (
                <RevealSection key={course.id} delay={i * 0.08}>
                  <CourseCard course={course} />
                </RevealSection>
              ))}
            </div>
          )}
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
                  className="flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:gap-8 sm:py-8"
                >
                  <Typography className="font-mono-ui" sx={{ color: 'text.secondary', minWidth: { sm: 48 }, fontSize: '0.9rem' }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Typography variant="h5" sx={{ minWidth: { sm: 220 }, textTransform: 'lowercase', color: 'primary.main' }}>
                    {item.step}
                  </Typography>
                  <div className="flex flex-col gap-1">
                    <Typography color="text.primary">{item.desc}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.detail}</Typography>
                  </div>
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
            <Typography variant="h3" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Built for learners and instructors alike.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 600, mb: { xs: 4, md: 6 } }}>
              Toggle between what a student sees and what an instructor manages the platform
              adapts its dashboard entirely depending on your role.
            </Typography>
          </RevealSection>

          <RevealSection delay={0.1}>
            <DashboardPreviewToggle />
          </RevealSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <RevealSection>
            <Typography variant="overline" color="primary.main">$ faq --list</Typography>
            <Typography variant="h3" sx={{ mt: 1, mb: { xs: 4, md: 6 }, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Questions, answered.
            </Typography>
          </RevealSection>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <RevealSection key={faq.q} delay={i * 0.05}>
                <Accordion
                  disableGutters
                  elevation={0}
                  expanded={expandedFaq === faq.q}
                  onChange={() => setExpandedFaq(expandedFaq === faq.q ? false : faq.q)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:before': { display: 'none' },
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Closing detail bar */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: DarkModeOutlinedIcon, label: 'dark mode built in' },
            { icon: WorkspacePremiumOutlinedIcon, label: 'certificates are publicly verifiable' },
            { icon: CodeOutlinedIcon, label: 'playground runs sandboxed, client-side' },
            { icon: CategoryOutlinedIcon, label: 'catalog organized by category' },
            { icon: BookmarkBorderOutlinedIcon, label: 'save courses for later' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" className="font-mono-ui">{label}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* CTA only shown to logged-out visitors; logged-in users get a
          continue-learning prompt pointing at their own dashboard instead */}
      <section className="border-t" style={{ borderColor: 'inherit' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 md:px-8 md:py-20 text-center flex flex-col items-center gap-6">
          {isAuthenticated ? (
            <>
              <RevealSection>
                <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                  Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
                </Typography>
              </RevealSection>
              <RevealSection delay={0.1}>
                <Button
                  component={RouterLink}
                  to={user?.role === 'ADMIN' ? ROUTES.ADMIN.OVERVIEW : ROUTES.DASHBOARD}
                  variant="contained"
                  disableElevation
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px -8px var(--mui-palette-primary-main, #2DD4BF)' },
                  }}
                >
                  Go to your dashboard
                </Button>
              </RevealSection>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;