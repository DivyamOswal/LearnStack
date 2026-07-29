import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link, CircularProgress, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegister } from '../authApi';
import { ROUTES } from '@/routes/routePaths';
import PasswordField from './PasswordField';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
};

const strengthMeta = [
  { label: '', color: 'divider' },
  { label: 'Weak', color: 'error.main' },
  { label: 'Fair', color: 'warning.main' },
  { label: 'Good', color: 'info.main' },
  { label: 'Strong', color: 'primary.main' },
];

const CheckmarkBurst = () => (
  <motion.svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <motion.circle
      cx="24"
      cy="24"
      r="21"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
    <motion.path
      d="M14 24.5L21 31.5L34 16"
      stroke="var(--mui-palette-primary-main, #2DD4BF)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
    />
  </motion.svg>
);

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <AnimatePresence mode="wait">
      {registerMutation.isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <CheckmarkBurst />
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
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          noValidate
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -8 }}
        >
          <motion.div variants={itemVariants}>
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
          </motion.div>

          <Stack spacing={2.5}>
            <AnimatePresence>
              {registerMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert severity="error">
                    {(registerMutation.error as any)?.response?.data?.message ?? 'Registration failed. Please try again.'}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                autoComplete="name"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack spacing={0.75}>
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="At least 8 characters, one uppercase letter, one number"
                  required
                  fullWidth
                  autoComplete="new-password"
                />

                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3, 4].map((segment) => (
                            <motion.div
                              key={segment}
                              className="h-1 flex-1 rounded-full"
                              initial={false}
                              animate={{
                                backgroundColor:
                                  segment <= strength
                                    ? `var(--mui-palette-${strengthMeta[strength].color.replace('.', '-')}, #2DD4BF)`
                                    : 'var(--mui-palette-divider, #30363D)',
                              }}
                              transition={{ duration: 0.2 }}
                            />
                          ))}
                        </div>
                        <Typography
                          variant="caption"
                          className="font-mono-ui"
                          sx={{ minWidth: 44, color: strengthMeta[strength].color }}
                        >
                          {strengthMeta[strength].label}
                        </Typography>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div whileTap={{ scale: registerMutation.isPending ? 1 : 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disableElevation
                  disabled={registerMutation.isPending}
                  startIcon={registerMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 20px -8px var(--mui-palette-primary-main, #2DD4BF)',
                    },
                  }}
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Register'}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Divider sx={{ my: 0.5 }} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to={ROUTES.LOGIN} fontWeight={600}>
                  Log in
                </Link>
              </Typography>
            </motion.div>
          </Stack>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default RegisterForm;