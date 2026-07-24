import { IconButton } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useToggleBookmark } from '../studentDashboardApi';

interface BookmarkButtonProps {
  courseId: string;
  isBookmarked: boolean;
  size?: 'small' | 'medium';
}

const BookmarkButton = ({ courseId, isBookmarked, size = 'medium' }: BookmarkButtonProps) => {
  const toggleBookmark = useToggleBookmark();

  return (
    <IconButton
      size={size}
      onClick={(e) => {
        e.preventDefault(); // prevents navigating if this sits inside a RouterLink card
        e.stopPropagation();
        toggleBookmark.mutate(courseId);
      }}
      disabled={toggleBookmark.isPending}
      sx={{ color: isBookmarked ? 'primary.main' : 'text.secondary' }}
    >
      {isBookmarked ? <BookmarkIcon fontSize={size} /> : <BookmarkBorderIcon fontSize={size} />}
    </IconButton>
  );
};

export default BookmarkButton;