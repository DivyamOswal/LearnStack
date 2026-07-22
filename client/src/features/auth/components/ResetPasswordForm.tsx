import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
import { useResetPassword } from '../authApi';
import { ROUTES } from '@/routes/routePaths';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mismatchError, setMismatchError] = useState(false);

  const mutation = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMismatchError(true);
      return;
    }
    setMismatchError(false);

    mutation.mutate(
      { token, newPassword },
      { onSuccess: () => setTimeout(() => navigate(ROUTES.LOGIN), 2000) }
    );
  };

  if (!token) {
    return (
      <Alert severity="error">
        This reset link is missing its token. Please request a new one from{' '}
        <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD}>the forgot password page</Link>.
      </Alert>
    );
  }

  if (mutation.isSuccess) {
    return (
      <Stack spacing={2} textAlign="center">
        <Typography className="font-mono-ui" color="primary.main" sx={{ fontSize: '2rem' }}>✓</Typography>
        <Typography variant="h5" fontWeight={700}>Password reset</Typography>
        <Typography color="text.secondary">Redirecting you to log in...</Typography>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>Set a new password</Typography>

        {mutation.isError && (
          <Alert severity="error">
            {(mutation.error as any)?.response?.data?.message ?? 'This link may have expired. Please request a new one.'}
          </Alert>
        )}
        {mismatchError && <Alert severity="warning">Passwords don't match.</Alert>}

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

        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? 'Resetting...' : 'Reset password'}
        </Button>
      </Stack>
    </form>
  );
};

export default ResetPasswordForm;