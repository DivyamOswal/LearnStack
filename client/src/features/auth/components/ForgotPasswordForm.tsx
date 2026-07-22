import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
import { useForgotPassword } from '../authApi';
import { ROUTES } from '@/routes/routePaths';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const mutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  if (mutation.isSuccess) {
    return (
      <Stack spacing={2} textAlign="center">
        <Typography className="font-mono-ui" color="primary.main" sx={{ fontSize: '2rem' }}>
          ✓
        </Typography>
        <Typography variant="h5" fontWeight={700}>Check your inbox</Typography>
        <Typography color="text.secondary">
          If an account exists for <strong>{email}</strong>, we've sent a link to reset your password. It expires in 15 minutes.
        </Typography>
        <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
          Back to login
        </Link>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>Reset your password</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the email tied to your account and we'll send a reset link.
        </Typography>

        {mutation.isError && (
          <Alert severity="error">Something went wrong. Please try again.</Alert>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Send reset link'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Remembered it? <Link component={RouterLink} to={ROUTES.LOGIN}>Log in</Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default ForgotPasswordForm;