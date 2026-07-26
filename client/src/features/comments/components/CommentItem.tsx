import { useState } from 'react';
import { Avatar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAppSelector } from '@/app/hooks';
import { useLikeComment, useReportComment, useDeleteComment, useCreateComment } from '../commentsApi';
import CommentForm from './CommentForm';

interface CommentItemProps {
  lessonId: string;
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
  isReply?: boolean;
  parentId?: string;
  onReplySuccess?: () => void;
}

const timeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const CommentItem = ({ lessonId, id, content, likes, createdAt, user, isReply, parentId }: CommentItemProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  // Session-local guard: the backend stores likes as a plain counter with no
  // per-user tracking, so nothing server-side stops repeated likes from the
  // same person. This at least prevents accidental double-clicks in this tab.
  const [hasLikedThisSession, setHasLikedThisSession] = useState(false);

  const likeComment = useLikeComment(lessonId);
  const reportComment = useReportComment();
  const deleteComment = useDeleteComment(lessonId);
  const createComment = useCreateComment(lessonId);

  const isOwner = currentUser?.id === user.id;
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLike = () => {
    if (hasLikedThisSession) return;
    setHasLikedThisSession(true);
    likeComment.mutate(id);
  };

  const handleReply = (replyContent: string) => {
    createComment.mutate(
      { content: replyContent, parentId: parentId ?? id },
      { onSuccess: () => setShowReplyForm(false) }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={isReply ? 'pl-10' : ''}
    >
      <div className="flex gap-3">
        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 32, height: 32, fontSize: '0.85rem' }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary" className="font-mono-ui">
              {timeAgo(createdAt)}
            </Typography>
          </div>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{content}</Typography>

          <div className="flex items-center gap-3 mt-1">
            <motion.div whileTap={{ scale: 0.85 }}>
              <Button
                size="small"
                startIcon={
                  <motion.span
                    key={hasLikedThisSession ? 'liked' : 'unliked'}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{ display: 'flex' }}
                  >
                    {hasLikedThisSession ? (
                      <ThumbUpIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
                    )}
                  </motion.span>
                }
                onClick={handleLike}
                disabled={hasLikedThisSession}
                sx={{
                  minWidth: 0,
                  color: hasLikedThisSession ? 'primary.main' : 'text.secondary',
                  fontSize: '0.75rem',
                  '&.Mui-disabled': { color: 'primary.main' },
                }}
              >
                {likes + (hasLikedThisSession ? 1 : 0)}
              </Button>
            </motion.div>

            {!isReply && (
              <Button
                size="small"
                onClick={() => setShowReplyForm((v) => !v)}
                sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
              >
                Reply
              </Button>
            )}
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreHorizIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {(isOwner || isAdmin) && (
                <MenuItem
                  onClick={() => {
                    deleteComment.mutate(id);
                    setMenuAnchor(null);
                  }}
                >
                  Delete
                </MenuItem>
              )}
              {!isOwner && (
                <MenuItem
                  onClick={() => {
                    reportComment.mutate(id);
                    setMenuAnchor(null);
                  }}
                >
                  Report
                </MenuItem>
              )}
            </Menu>
          </div>

          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <CommentForm
                  onSubmit={handleReply}
                  isSubmitting={createComment.isPending}
                  placeholder="Write a reply..."
                  compact
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;