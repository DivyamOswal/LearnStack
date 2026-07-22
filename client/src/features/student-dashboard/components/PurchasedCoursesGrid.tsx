import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import { PurchasedCourseOrder } from '../studentDashboard.types';
import EmptyState from '@/components/ui/EmptyState';
import { ROUTES } from '@/routes/routePaths';

const PurchasedCoursesGrid = ({ orders }: { orders: PurchasedCourseOrder[] }) => {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="Browse the catalog and enroll in your first course to see it here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map(({ id, course }) => (
        <RouterLink
          key={id}
          to={ROUTES.COURSE_DETAIL(course.slug)}
          className="flex flex-col overflow-hidden rounded-lg border no-underline text-inherit hover:opacity-90 transition-opacity"
          style={{ borderColor: 'inherit' }}
        >
          <div className="aspect-video w-full overflow-hidden" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
            {course.thumbnailUrl && (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-3">
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.title}</Typography>
          </div>
        </RouterLink>
      ))}
    </div>
  );
};

export default PurchasedCoursesGrid;