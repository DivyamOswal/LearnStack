import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Stack, Link } from '@mui/material';
// import { useRegister } from '../authApi';
import { ROUTES } from '@/routes/routePaths';
import { useRegister } from '../authApi';

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
    return <Alert severity="success">Registration successful! Check your email ({email}) to verify your account.</Alert>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>Create your account</Typography>
        {registerMutation.isError && (
          <Alert severity="error">
            {(registerMutation.error as any)?.response?.data?.message ?? 'Registration failed. Please try again.'}
          </Alert>
        )}
        <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} helperText="At least 8 characters, one uppercase letter, one number" required fullWidth />
        <Button type="submit" variant="contained" size="large" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Creating account...' : 'Register'}
        </Button>
        <Typography variant="body2" textAlign="center">
          Already have an account? <Link component={RouterLink} to={ROUTES.LOGIN}>Log in</Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default RegisterForm;