import { Typography, Button, Chip, CircularProgress } from '@mui/material';
import { useReportedComments, useDismissReport, useDeleteReportedComment } from '@/features/admin/moderation/adminModerationApi';
import EmptyState from '@/components/ui/EmptyState';

const AdminModerationPage = () => {
  const { data: reported, isLoading } = useReportedComments();
  const dismissReport = useDismissReport();
  const deleteComment = useDeleteReportedComment();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --moderation
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Reported comments
      </Typography>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && reported && reported.length === 0 && (
        <EmptyState title="Nothing to review" description="No comments have been reported." />
      )}

      {!isLoading && reported && reported.length > 0 && (
        <div className="flex flex-col gap-4">
          {reported.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-md flex flex-col gap-3" style={{ borderColor: 'inherit' }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{comment.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{comment.user.email}</Typography>
                </div>
                <Chip label="reported" size="small" color="warning" className="font-mono-ui" />
              </div>

              <Typography variant="body2">{comment.content}</Typography>

              <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                on lesson: {comment.lesson.title}
              </Typography>

              <div className="flex gap-2 mt-1">
                <Button size="small" onClick={() => dismissReport.mutate(comment.id)} disabled={dismissReport.isPending}>
                  Dismiss report
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteComment.mutate(comment.id)}
                  disabled={deleteComment.isPending}
                >
                  Delete comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminModerationPage;