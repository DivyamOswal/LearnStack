import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, CircularProgress } from '@mui/material';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { useAdminCourseList } from '@/features/admin/courses/adminCourseApi';
import EmptyState from '@/components/ui/EmptyState';

const AdminQuizzesPage = () => {
  const { data, isLoading } = useAdminCourseList(1);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --quizzes
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Manage quizzes
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
        <div className="flex flex-col gap-2">
          {data.courses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 p-3 rounded-md border" style={{ borderColor: 'inherit' }}>
              <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{course.title}</Typography>
              <Button
                component={RouterLink}
                to={`/admin/quizzes/manage?courseId=${course.id}`}
                size="small"
                startIcon={<QuizOutlinedIcon fontSize="small" />}
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