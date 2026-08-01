import { Typography, Button, Chip, CircularProgress, Avatar } from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { useReportedComments, useDismissReport, useDeleteReportedComment } from '@/features/admin/moderation/adminModerationApi';
import EmptyState from '@/components/ui/EmptyState';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const AdminModerationPage = () => {
  const { data: reported, isLoading } = useReportedComments();
  const dismissReport = useDismissReport();
  const deleteComment = useDeleteReportedComment();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.08))',
            border: '1px solid rgba(251,191,36,0.4)',
          }}
        >
          <FlagOutlinedIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
        </div>
        <Typography variant="overline" color="primary.main" className="font-mono-ui">
          $ admin --moderation
        </Typography>
      </div>
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Reported comments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
        Review flagged comments and take action.
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
            <div
              key={comment.id}
              style={{
                ...glassPanel,
                border: '1px solid rgba(251,191,36,0.2)',
              }}
              className="p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      bgcolor: 'rgba(99,102,241,0.2)',
                      color: 'primary.main',
                      border: '1px solid rgba(99,102,241,0.3)',
                    }}
                  >
                    {comment.user.name?.[0]?.toUpperCase() ?? '?'}
                  </Avatar>
                  <div className="flex flex-col">
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{comment.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>{comment.user.email}</Typography>
                  </div>
                </div>
                <Chip
                  label="reported"
                  size="small"
                  className="font-mono-ui"
                  sx={{
                    bgcolor: 'rgba(251,191,36,0.12)',
                    color: '#fbbf24',
                    border: '1px solid rgba(251,191,36,0.3)',
                    fontWeight: 600,
                  }}
                />
              </div>

              <Typography
                variant="body2"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  p: 2,
                  lineHeight: 1.6,
                }}
              >
                {comment.content}
              </Typography>

              <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                on lesson: {comment.lesson.title}
              </Typography>

              <div className="flex gap-2 mt-1">
                <Button
                  size="small"
                  onClick={() => dismissReport.mutate(comment.id)}
                  disabled={dismissReport.isPending}
                  sx={{ textTransform: 'none', borderRadius: 2, color: 'text.secondary' }}
                >
                  Dismiss report
                </Button>
                <Button
                  size="small"
                  onClick={() => deleteComment.mutate(comment.id)}
                  disabled={deleteComment.isPending}
                  sx={{ textTransform: 'none', borderRadius: 2, color: '#f87171' }}
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