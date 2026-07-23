import { Typography, CircularProgress } from '@mui/material';
import { useCommentsForLesson, useCreateComment } from '../commentsApi';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import EmptyState from '@/components/ui/EmptyState';

const CommentThread = ({ lessonId }: { lessonId: string }) => {
  const { data: comments, isLoading } = useCommentsForLesson(lessonId);
  const createComment = useCreateComment(lessonId);

  const handleNewComment = (content: string) => {
    createComment.mutate({ content });
  };

  return (
    <div className="flex flex-col gap-6 mt-10 pt-8 border-t" style={{ borderColor: 'inherit' }}>
      <Typography variant="h6">Discussion</Typography>

      <CommentForm onSubmit={handleNewComment} isSubmitting={createComment.isPending} />

      {isLoading && (
        <div className="flex justify-center py-8">
          <CircularProgress size={24} />
        </div>
      )}

      {!isLoading && comments && comments.length === 0 && (
        <EmptyState title="No comments yet" description="Be the first to ask a question." />
      )}

      {!isLoading && comments && comments.length > 0 && (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-4">
              <CommentItem
                lessonId={lessonId}
                id={comment.id}
                content={comment.content}
                likes={comment.likes}
                createdAt={comment.createdAt}
                user={comment.user}
              />
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  lessonId={lessonId}
                  id={reply.id}
                  content={reply.content}
                  likes={reply.likes}
                  createdAt={reply.createdAt}
                  user={reply.user}
                  isReply
                  parentId={comment.id}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;