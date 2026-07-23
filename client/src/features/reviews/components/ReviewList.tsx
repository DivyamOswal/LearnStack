import { Avatar, Typography, Rating, Pagination } from '@mui/material';
import { Review } from '../review.types';
import EmptyState from '@/components/ui/EmptyState';

interface ReviewListProps {
  reviews: Review[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const timeAgo = (dateStr: string) => {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays < 1) return 'today';
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const ReviewList = ({ reviews, page, totalPages, onPageChange }: ReviewListProps) => {
  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to review this course." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-3">
          <Avatar src={review.user.avatarUrl ?? undefined} sx={{ width: 36, height: 36 }}>
            {review.user.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{review.user.name}</Typography>
              <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                {timeAgo(review.createdAt)}
              </Typography>
            </div>
            <Rating value={review.rating} readOnly size="small" sx={{ my: 0.5 }} />
            {review.comment && (
              <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
            )}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-2">
          <Pagination count={totalPages} page={page} onChange={(_, value) => onPageChange(value)} color="primary" shape="rounded" size="small" />
        </div>
      )}
    </div>
  );
};

export default ReviewList;