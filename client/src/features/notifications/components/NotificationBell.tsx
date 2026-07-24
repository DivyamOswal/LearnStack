import { useState } from 'react';
import { IconButton, Badge, Menu, Typography, Button, Divider, CircularProgress, Box } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useMyNotifications, useMarkNotificationRead, useMarkAllRead } from '../notificationsApi';

const timeAgo = (dateStr: string) => {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const unreadCount = data?.unreadCount ?? 0;
  const hasNotifications = Boolean(data && data.notifications.length > 0);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Notifications"
        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={9}
          sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}
        >
          <NotificationsOutlinedIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 440, mt: 1 } } }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              sx={{ fontSize: '0.75rem', minWidth: 0, p: 0 }}
            >
              Mark all read
            </Button>
          )}
        </div>
        <Divider />

        {isLoading && (
          <div className="flex justify-center py-8">
            <CircularProgress size={20} />
          </div>
        )}

        {!isLoading && !hasNotifications && (
          <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
            <NotificationsNoneIcon sx={{ fontSize: 32, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              You're all caught up.
            </Typography>
          </div>
        )}

        {!isLoading && hasNotifications && (
          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {data!.notifications.map((n) => (
              <Box
                key={n.id}
                onClick={() => !n.isRead && markRead.mutate(n.id)}
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: n.isRead ? 'default' : 'pointer',
                  bgcolor: n.isRead ? 'transparent' : 'action.hover',
                  borderLeft: '3px solid',
                  borderColor: n.isRead ? 'transparent' : 'primary.main',
                  transition: 'background-color 0.15s ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: n.isRead ? 400 : 600 }}>
                  {n.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" className="font-mono-ui" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                  {timeAgo(n.createdAt)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;