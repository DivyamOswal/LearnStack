import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Alert, Stack, Link } from '@mui/material';
// import { useLogin } from '../authApi';
import { ROUTES } from '@/routes/routePaths';
import { useLogin } from '../authApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password, rememberMe }, { onSuccess: () => navigate(from, { replace: true }) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>Log in to LearnStack</Typography>
        {loginMutation.isError && (
          <Alert severity="error">
            {(loginMutation.error as any)?.response?.data?.message ?? 'Login failed. Please try again.'}
          </Alert>
        )}
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Remember me" />
        <Button type="submit" variant="contained" size="large" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Log In'}
        </Button>
        <Stack direction="row" justifyContent="space-between">
          <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2">Forgot password?</Link>
          <Link component={RouterLink} to={ROUTES.REGISTER} variant="body2">Create an account</Link>
        </Stack>
      </Stack>
    </form>
  );
};

export default LoginForm;