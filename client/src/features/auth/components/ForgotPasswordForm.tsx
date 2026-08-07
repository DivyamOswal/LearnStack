import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForgotPassword } from '../authApi';
import { ROUTES } from '@/routes/routePaths';

const CheckmarkIcon = () => (
  <motion.svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <motion.circle
      cx="28"
      cy="28"
      r="26"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
    <motion.path
      d="M17 28.5L24.5 36L39 20"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
    />
  </motion.svg>
);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const mutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email }); // matches ForgotPasswordPayload was previously sending a raw string
  };

  return (
    <AnimatePresence mode="wait">
      {mutation.isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <CheckmarkIcon />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Check your inbox
            </Typography>
            <Typography color="text.secondary">
              If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.
              It expires in 15 minutes.
            </Typography>
            <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
              Back to login
            </Link>
          </Stack>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Reset your password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the email tied to your account and we'll send a reset link.
            </Typography>

            <AnimatePresence>
              {mutation.isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert severity="error">Something went wrong. Please try again.</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <motion.div whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                disableElevation
                size="large"
                fullWidth
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Sending...' : 'Send reset link'}
              </Button>
            </motion.div>

            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Remembered it?{' '}
              <Link component={RouterLink} to={ROUTES.LOGIN}>
                Log in
              </Link>
            </Typography>
          </Stack>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordForm;