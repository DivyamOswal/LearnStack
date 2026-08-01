import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Course } from '../course.types';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/routes/routePaths';
import BookmarkButton from '@/features/student-dashboard/components/BookmarkButton';

const CourseCard = ({ course }: { course: Course & { isBookmarked?: boolean } }) => {
  const hasDiscount = course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const showRealImage = Boolean(course.thumbnailUrl) && !imageFailed;

  return (
    <RouterLink
      to={ROUTES.COURSE_DETAIL(course.slug)}
      className="group flex flex-col overflow-hidden rounded-xl no-underline text-inherit transition-all duration-300 hover:-translate-y-1 relative"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      <div
        className="aspect-video w-full overflow-hidden relative"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
      >
        {showRealImage ? (
          <>
            {/* Skeleton shimmer while the real image is still loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton-shimmer" />
            )}
            <img
              src={course.thumbnailUrl!}
              alt={course.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <ImageOutlinedIcon sx={{ fontSize: 28 }} />
            <Typography className="font-mono-ui" sx={{ fontSize: '0.75rem' }}>
              no_preview.png
            </Typography>
          </div>
        )}

        {hasDiscount && (
          <div
            className="absolute top-3 right-3 font-mono-ui"
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(34,197,94,0.15)',
              color: '#4ade80',
              border: '1px solid rgba(34,197,94,0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            SALE
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Chip
            label={course.category.name}
            size="small"
            className="font-mono-ui"
            sx={{
              bgcolor: 'rgba(99,102,241,0.1)',
              color: 'primary.main',
              border: '1px solid rgba(99,102,241,0.25)',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          />
          <BookmarkButton courseId={course.id} isBookmarked={course.isBookmarked ?? false} size="small" />
        </div>

        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
          {course.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="line-clamp-2">
          {course.description}
        </Typography>

        <div
          className="flex items-center gap-3 mt-1 font-mono-ui text-xs"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <span className="flex items-center gap-1">
            <StarIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
            {course._count.reviews} reviews
          </span>
          <span className="flex items-center gap-1">
            <PeopleOutlinedIcon sx={{ fontSize: 14 }} />
            {course._count.orders} enrolled
          </span>
        </div>

        <div
          className="flex items-baseline gap-2 mt-2 pt-3 font-mono-ui"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {hasDiscount ? (
            <>
              <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.05rem' }}>
                {formatCurrency(course.discountPrice!)}
              </Typography>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {formatCurrency(course.price)}
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>{formatCurrency(course.price)}</Typography>
          )}
        </div>
      </div>
    </RouterLink>
  );
};

export default CourseCard;