import { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
  compact?: boolean;
}

const CommentForm = ({ onSubmit, isSubmitting, placeholder = 'Ask a question or share a thought...', compact = false }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        multiline
        rows={compact ? 1 : 2}
        size="small"
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disableElevation
        size="small"
        disabled={isSubmitting || !content.trim()}
        sx={{ alignSelf: 'flex-start' }}
      >
        {isSubmitting ? 'Posting...' : 'Post'}
      </Button>
    </form>
  );
};

export default CommentForm;