import { Typography } from '@mui/material';
import BroadcastForm from '@/features/admin/components/notifications/BroadcastForm';

const AdminNotificationsPage = () => {
  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --broadcast
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Send a notification
      </Typography>

      <BroadcastForm />
    </div>
  );
};

export default AdminNotificationsPage;