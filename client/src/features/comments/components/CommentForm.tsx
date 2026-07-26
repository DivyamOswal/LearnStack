import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
  compact?: boolean;
}

const MAX_LENGTH = 2000;

const CommentForm = ({
  onSubmit,
  isSubmitting,
  placeholder = 'Ask a question or share a thought...',
  compact = false,
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  const nearLimit = content.length > MAX_LENGTH * 0.85;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px var(--mui-palette-primary-main, #2DD4BF)'
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.15 }}
        style={{ borderRadius: 8 }}
      >
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          multiline
          rows={compact ? 1 : 2}
          size="small"
          fullWidth
        />
      </motion.div>

      <div className="flex items-center justify-between">
        <AnimatePresence>
          {nearLimit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography
                variant="caption"
                className="font-mono-ui"
                color={content.length >= MAX_LENGTH ? 'error.main' : 'text.secondary'}
              >
                {content.length}/{MAX_LENGTH}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileTap={{ scale: isSubmitting ? 1 : 0.96 }} style={{ marginLeft: 'auto' }}>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            size="small"
            disabled={isSubmitting || !content.trim()}
            startIcon={!isSubmitting && <SendIcon sx={{ fontSize: 14 }} />}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default CommentForm;