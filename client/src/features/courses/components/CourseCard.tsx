import { Link as RouterLink } from 'react-router-dom';
import { Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { Course } from '../course.types';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTES } from '@/routes/routePaths';

const CourseCard = ({ course }: { course: Course }) => {
  const hasDiscount = course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price);

  return (
    <RouterLink
      to={ROUTES.COURSE_DETAIL(course.slug)}
      className="group flex flex-col overflow-hidden rounded-lg border no-underline text-inherit transition-transform hover:-translate-y-1"
      style={{ borderColor: 'var(--mui-palette-divider, #30363D)' }}
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono-ui text-sm opacity-40">
            no_preview.png
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <Chip
          label={course.category.name}
          size="small"
          className="font-mono-ui self-start"
          sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontSize: '0.7rem' }}
        />

        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3 }}>
          {course.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="line-clamp-2">
          {course.description}
        </Typography>

        <div className="flex items-center gap-3 mt-1 font-mono-ui text-xs" style={{ color: 'var(--mui-palette-text-secondary, #7D8590)' }}>
          <span className="flex items-center gap-1">
            <StarIcon sx={{ fontSize: 14, color: 'primary.main' }} />
            {course._count.reviews} reviews
          </span>
          <span className="flex items-center gap-1">
            <PeopleOutlinedIcon sx={{ fontSize: 14 }} />
            {course._count.orders} enrolled
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2 font-mono-ui">
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
    </RouterLink>
  );
};

export default CourseCard;