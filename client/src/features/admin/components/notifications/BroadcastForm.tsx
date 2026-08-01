import { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Alert } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { useBroadcastNotification } from '../../notifications/adminNotificationApi';
import { BroadcastTarget } from '../../../admin/notifications/adminNotifications.types';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

const BroadcastForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<BroadcastTarget>('ALL');

  const broadcast = useBroadcastNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    broadcast.mutate(
      { title, message, targetRole },
      { onSuccess: () => { setTitle(''); setMessage(''); } }
    );
  };

  return (
    <form onSubmit={handleSubmit} style={glassPanel} className="flex flex-col gap-4 max-w-lg p-5 relative overflow-hidden">
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)' }}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))',
            border: '1px solid rgba(99,102,241,0.4)',
          }}
        >
          <CampaignOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </div>
        <Typography
          variant="caption"
          className="font-mono-ui"
          sx={{ color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase' }}
        >
          New broadcast
        </Typography>
      </div>

      {broadcast.isError && (
        <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          {(broadcast.error as any)?.response?.data?.message ?? 'Failed to send broadcast.'}
        </Alert>
      )}
      {broadcast.isSuccess && (
        <Alert severity="success" sx={{ bgcolor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
          Sent to {broadcast.data?.notifiedCount} user{broadcast.data?.notifiedCount === 1 ? '' : 's'}.
        </Alert>
      )}

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        fullWidth
        required
      />

      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        rows={3}
        size="small"
        fullWidth
        required
      />

      <TextField
        select
        label="Send to"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value as BroadcastTarget)}
        size="small"
        fullWidth
      >
        <MenuItem value="ALL">Everyone</MenuItem>
        <MenuItem value="STUDENT">Students only</MenuItem>
        <MenuItem value="ADMIN">Admins only</MenuItem>
      </TextField>

      <Button
        type="submit"
        variant="contained"
        disableElevation
        startIcon={<CampaignOutlinedIcon />}
        disabled={broadcast.isPending}
        sx={{
          alignSelf: 'flex-start',
          borderRadius: 2,
          px: 3,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
        }}
      >
        {broadcast.isPending ? 'Sending...' : 'Send broadcast'}
      </Button>

      <Typography variant="caption" color="text.secondary">
        This creates an in-app notification for every matching user — there's no email sent alongside it.
      </Typography>
    </form>
  );
};

export default BroadcastForm;