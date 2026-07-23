import { useState } from 'react';
import { Rating, TextField, Button, Typography, Alert } from '@mui/material';
import { useCreateReview } from '../reviewsApi';

const ReviewForm = ({ courseId }: { courseId: string }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');

  const createReview = useCreateReview(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    createReview.mutate(
      { rating, comment: comment || undefined },
      { onSuccess: () => setComment('') }
    );
  };

  if (createReview.isSuccess) {
    return <Alert severity="success">Thanks for your review!</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Typography variant="subtitle2">Leave a review</Typography>

      {createReview.isError && (
        <Alert severity="error">
          {(createReview.error as any)?.response?.data?.message ?? 'Failed to submit review.'}
        </Alert>
      )}

      <Rating
        value={rating}
        onChange={(_, value) => setRating(value)}
        size="large"
      />

      <TextField
        placeholder="What did you think of this course? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
        size="small"
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        disableElevation
        disabled={!rating || createReview.isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        {createReview.isPending ? 'Submitting...' : 'Submit review'}
      </Button>
    </form>
  );
};

export default ReviewForm;