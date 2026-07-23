import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link, CircularProgress, Divider } from '@mui/material';
import { useRegister } from '../authApi';
import { ROUTES } from '@/routes/routePaths';
import PasswordField from './PasswordField';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  if (registerMutation.isSuccess) {
    return (
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <Typography variant="h5" fontWeight={700}>
          Check your inbox
        </Typography>
        <Alert severity="success" sx={{ width: '100%' }}>
          We sent a verification link to <strong>{email}</strong>. Confirm your email to finish setting up your account.
        </Alert>
        <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
          Back to log in
        </Link>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={0.5} mb={3}>
        <Typography
          component="span"
          className="font-mono-ui"
          sx={{ color: 'primary.main', fontSize: '0.75rem', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}
        >
          Get started
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start learning and building today, free.
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {registerMutation.isError && (
          <Alert severity="error">
            {(registerMutation.error as any)?.response?.data?.message ?? 'Registration failed. Please try again.'}
          </Alert>
        )}

        <TextField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          autoComplete="name"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoComplete="email"
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="At least 8 characters, one uppercase letter, one number"
          required
          fullWidth
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disableElevation
          disabled={registerMutation.isPending}
          startIcon={registerMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {registerMutation.isPending ? 'Creating account...' : 'Register'}
        </Button>

        <Divider sx={{ my: 0.5 }} />

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN} fontWeight={600}>
            Log in
          </Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default RegisterForm;