import { useState } from 'react';
import { TextField, Button, Alert, Stack } from '@mui/material';
import { useChangePassword } from '../profileApi';
import { useLogout } from '@/features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mismatchError, setMismatchError] = useState(false);

  const changePassword = useChangePassword();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMismatchError(true);
      return;
    }
    setMismatchError(false);

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setTimeout(() => {
            logout.mutate(undefined, { onSuccess: () => navigate(ROUTES.LOGIN) });
          }, 1500);
        },
      }
    );
  };

  if (changePassword.isSuccess) {
    return (
      <Alert severity="success">
        Password changed successfully. Logging you out for security -please log back in.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <Stack spacing={2}>
        {changePassword.isError && (
          <Alert severity="error">
            {(changePassword.error as any)?.response?.data?.message ?? 'Failed to change password.'}
          </Alert>
        )}
        {mismatchError && <Alert severity="warning">New passwords don't match.</Alert>}

        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          helperText="At least 8 characters, one uppercase letter, one number"
          required
          fullWidth
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
        />

        <Button type="submit" variant="contained" disableElevation size="large" disabled={changePassword.isPending} sx={{ alignSelf: 'flex-start' }}>
          {changePassword.isPending ? 'Changing...' : 'Change password'}
        </Button>
      </Stack>
    </form>
  );
};

export default ChangePasswordForm;