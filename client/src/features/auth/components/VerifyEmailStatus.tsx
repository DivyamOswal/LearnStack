import { useEffect, useRef } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Button, Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useVerifyEmail } from '../authApi';
import { ROUTES } from '@/routes/routePaths';

const VerifyEmailStatus = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const verifyEmail = useVerifyEmail();
  const hasFired = useRef(false);

  useEffect(() => {
    // Guard against double-firing in React 18/19 StrictMode dev double-invoke,
    // and against re-running if this component re-renders for any other reason.
    if (token && !hasFired.current) {
      hasFired.current = true;
      verifyEmail.mutate(token);
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="error">
        This verification link is missing its token. Please check the link from your email, or{' '}
        <RouterLink to={ROUTES.LOGIN}>log in</RouterLink> and request a new one.
      </Alert>
    );
  }

  if (verifyEmail.isPending || verifyEmail.isIdle) {
    return (
      <Stack spacing={2} alignItems="center" textAlign="center">
        <CircularProgress size={32} />
        <Typography color="text.secondary">Verifying your email...</Typography>
      </Stack>
    );
  }

  if (verifyEmail.isError) {
    return (
      <Stack spacing={2} alignItems="center" textAlign="center">
        <CancelOutlinedIcon sx={{ fontSize: 48, color: 'error.main' }} />
        <Typography variant="h5" fontWeight={700}>Verification failed</Typography>
        <Typography color="text.secondary">
          {(verifyEmail.error as any)?.response?.data?.message ?? 'This link may be invalid or expired.'}
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="outlined">
          Back to login
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} alignItems="center" textAlign="center">
      <CheckCircleOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      <Typography variant="h5" fontWeight={700}>Email verified</Typography>
      <Typography color="text.secondary">{verifyEmail.data}</Typography>
      <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained" disableElevation>
        Log in now
      </Button>
    </Stack>
  );
};

export default VerifyEmailStatus;