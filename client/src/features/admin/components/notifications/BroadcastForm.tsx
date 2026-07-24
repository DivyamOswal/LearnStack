import { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Alert } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { useBroadcastNotification } from '../../notifications/adminNotificationApi';
import { BroadcastTarget } from '../../../admin/notifications/adminNotifications.types';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {broadcast.isError && (
        <Alert severity="error">
          {(broadcast.error as any)?.response?.data?.message ?? 'Failed to send broadcast.'}
        </Alert>
      )}
      {broadcast.isSuccess && (
        <Alert severity="success">
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
        sx={{ alignSelf: 'flex-start' }}
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