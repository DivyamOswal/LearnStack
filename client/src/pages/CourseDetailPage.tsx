import { useParams } from 'react-router-dom';
import { Typography, Button, Chip, CircularProgress, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { useCourseBySlug } from '@/features/courses/coursesApi';
import { useCreateCheckoutSession } from '@/features/payments/paymentsApi';
import CourseCurriculum from '@/features/courses/components/CourseCurriculum';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { useState } from 'react';
import { useReviewsForCourse, useRatingDistribution } from '@/features/reviews/reviewsApi';
import RatingDistributionChart from '@/features/reviews/components/RatingDistributionChart';
import ReviewForm from '@/features/reviews/components/ReviewForm';
import ReviewList from '@/features/reviews/components/ReviewList';

const CourseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: course, isLoading, isError } = useCourseBySlug(slug ?? '');
  const checkoutMutation = useCreateCheckoutSession();
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewData } = useReviewsForCourse(course?.id ?? '', reviewPage);
  const { data: distribution } = useRatingDistribution(course?.id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !course) {
    return <EmptyState title="Course not found" description="This course may be unpublished or no longer exists." />;
  }

  const hasDiscount = course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.COURSE_DETAIL(course.slug) } } });
      return;
    }
    checkoutMutation.mutate({ courseId: course.id });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 md:px-8 md:py-14">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Chip
            label={course.category.name}
            size="small"
            className="font-mono-ui"
            sx={{ bgcolor: 'action.hover', color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, mb: 2 }}>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 640 }}>
            {course.description}
          </Typography>

          <div className="flex items-center gap-4 mb-6 font-mono-ui text-sm" style={{ color: 'inherit' }}>
            <span className="flex items-center gap-1">
              <StarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              {course._count.reviews} reviews
            </span>
            <span className="flex items-center gap-1">
              <PeopleOutlinedIcon sx={{ fontSize: 16 }} />
              {course._count.orders} students enrolled
            </span>
          </div>

          {course.thumbnailUrl && (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full rounded-lg mb-8 aspect-video object-cover"
            />
          )}

          <Divider sx={{ mb: 6 }} />

          <CourseCurriculum chapters={course.chapters} />
          <Divider sx={{ my: 6 }} />

          <div className="flex flex-col gap-8">
            <Typography variant="h5">Reviews</Typography>

            {distribution && reviewData && (
              <RatingDistributionChart
                distribution={distribution}
                averageRating={reviewData.averageRating}
                ratingCount={reviewData.ratingCount}
              />
            )}

            {isAuthenticated && <ReviewForm courseId={course.id} />}

            {reviewData && (
              <ReviewList
                reviews={reviewData.reviews}
                page={reviewPage}
                totalPages={reviewData.totalPages}
                onPageChange={setReviewPage}
              />
            )}
          </div>
        </div>

        {/* Sticky purchase card */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 border rounded-lg p-6 flex flex-col gap-4" style={{ borderColor: 'inherit' }}>
            <div className="flex items-baseline gap-2 font-mono-ui">
              {hasDiscount ? (
                <>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(course.discountPrice!)}
                  </Typography>
                  <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    {formatCurrency(course.price)}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 700 }}>{formatCurrency(course.price)}</Typography>
              )}
            </div>

            <Button
              variant="contained"
              disableElevation
              size="large"
              fullWidth
              onClick={handleEnroll}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? 'Redirecting...' : 'Enroll now'}
            </Button>

            <Divider />

            <Typography variant="body2" color="text.secondary">
              Taught by <strong>{course.createdBy.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" className="font-mono-ui">
              {course.chapters.reduce((sum, c) => sum + c.lessons.length, 0)} lessons · {course.quizzes.length} quizzes
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;