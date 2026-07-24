import { Link as RouterLink } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';
import { useMyBookmarks } from '@/features/student-dashboard/studentDashboardApi';
import BookmarkButton from '@/features/student-dashboard/components/BookmarkButton';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/routes/routePaths';

const BookmarksPage = () => {
  const { data: bookmarks, isLoading } = useMyBookmarks();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ bookmarks --my
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Your bookmarks
      </Typography>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && bookmarks && bookmarks.length === 0 && (
        <EmptyState title="No bookmarks yet" description="Save courses you're interested in to find them here later." />
      )}

      {!isLoading && bookmarks && bookmarks.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map(({ id, course }) => {
            const hasDiscount = course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price);
            return (
              <div key={id} className="border rounded-lg overflow-hidden flex flex-col" style={{ borderColor: 'inherit' }}>
                <RouterLink to={ROUTES.COURSE_DETAIL(course.slug)} className="no-underline text-inherit">
                  <div className="aspect-video w-full overflow-hidden" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
                    {course.thumbnailUrl && (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                </RouterLink>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <RouterLink to={ROUTES.COURSE_DETAIL(course.slug)} className="no-underline text-inherit">
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{course.title}</Typography>
                    </RouterLink>
                    <BookmarkButton courseId={course.id} isBookmarked size="small" />
                  </div>
                  <div className="flex items-baseline gap-2 font-mono-ui">
                    {hasDiscount ? (
                      <>
                        <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(course.discountPrice!)}
                        </Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          {formatCurrency(course.price)}
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(course.price)}</Typography>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;