import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Stack,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useLogin } from "../authApi";
import { ROUTES } from "@/routes/routePaths";
import PasswordField from "./PasswordField";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    ROUTES.DASHBOARD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: () => navigate(from, { replace: true }),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.75}>
        <Stack spacing={0.75}>
          <Typography
            component="span"
            sx={{
              color: "primary.main",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              lineHeight: 1.2,
            }}
          >
            Log in to LearnStack
          </Typography>

          <Typography component="p" variant="body1" color="text.secondary">
            Pick up right where you left off.
          </Typography>
        </Stack>

        {loginMutation.isError && (
          <Alert severity="error">
            {(loginMutation.error as any)?.response?.data?.message ??
              "Login failed. Please try again."}
          </Alert>
        )}

        <Stack spacing={2.5}>
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
            required
            fullWidth
            autoComplete="current-password"
          />
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: -0.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Checkbox
              size="small"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                p: 0,
              }}
            />

            <Typography component="span" variant="body2">
              Remember me
            </Typography>
          </Stack>

          <Link
            component={RouterLink}
            to={ROUTES.FORGOT_PASSWORD}
            underline="hover"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </Link>
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          sx={{
            height: 52,
            borderRadius: 2,
            fontWeight: 600,
          }}
          disabled={loginMutation.isPending}
          startIcon={
            loginMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {loginMutation.isPending ? "Logging in..." : "Log In"}
        </Button>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to={ROUTES.REGISTER}
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            Create one
          </Link>
        </Typography>
      </Stack>
    </form>
  );
};

export default LoginForm;
