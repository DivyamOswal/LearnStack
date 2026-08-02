import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, CircularProgress, Chip } from '@mui/material';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAdminCourseList } from '@/features/admin/courses/adminCourseApi';
import EmptyState from '@/components/ui/EmptyState';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const AdminQuizzesPage = () => {
  const { data, isLoading } = useAdminCourseList(1);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
            border: '1px solid rgba(99,102,241,0.4)',
          }}
        >
          <QuizOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </div>
        <Typography variant="overline" color="primary.main" className="font-mono-ui">
          $ admin --quizzes
        </Typography>
      </div>

      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Manage quizzes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
        Quizzes are attached to a course. Pick a course below to build or edit its questions.
      </Typography>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.courses.length === 0 && (
        <EmptyState title="No courses yet" description="Create a course first — quizzes belong to a course." />
      )}

      {!isLoading && data && data.courses.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.courses.map((course) => (
            <div
              key={course.id}
              style={glassPanel}
              className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/5"
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: course.isPublished
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${course.isPublished ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <SchoolOutlinedIcon
                  sx={{ fontSize: 20, color: course.isPublished ? 'primary.main' : 'text.disabled' }}
                />
              </div>

              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }} noWrap>
                  {course.title}
                </Typography>
                <div className="flex items-center gap-2 flex-wrap">
                  {course.category?.name && (
                    <Chip
                      label={course.category.name}
                      size="small"
                      className="font-mono-ui"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                  <Chip
                    label={course.isPublished ? 'published' : 'draft'}
                    size="small"
                    className="font-mono-ui"
                    sx={{
                      bgcolor: course.isPublished ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                      color: course.isPublished ? '#4ade80' : 'text.secondary',
                      border: `1px solid ${course.isPublished ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <Button
                component={RouterLink}
                to={`/admin/quizzes/manage?courseId=${course.id}`}
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: 'rgba(99,102,241,0.12)',
                  color: 'primary.main',
                  border: '1px solid rgba(99,102,241,0.3)',
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(99,102,241,0.2)',
                  },
                }}
              >
                Manage quizzes
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuizzesPage;