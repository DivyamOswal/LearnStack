import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  Typography,
  Alert,
  Stack,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin } from "../authApi";
import { ROUTES } from "@/routes/routePaths";
import PasswordField from "./PasswordField";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

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
        onError: () => setShakeKey((k) => k + 1), // triggers the shake animation below
      },
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Stack spacing={2.75}>
        <Stack spacing={0.75}>
          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 700, fontSize: "2rem", lineHeight: 1.2 }}
            >
              Log in to LearnStack
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography component="p" variant="body1" color="text.secondary">
              Pick up right where you left off.
            </Typography>
          </motion.div>
        </Stack>

        <AnimatePresence>
          {loginMutation.isError && (
            <motion.div
              key={shakeKey}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                x: [0, -8, 8, -6, 6, -3, 3, 0],
              }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.2 },
                opacity: { duration: 0.2 },
                x: { duration: 0.4, delay: 0.05 },
              }}
            >
              <Alert severity="error">
                {(loginMutation.error as any)?.response?.data?.message ??
                  "Login failed. Please try again."}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.div variants={itemVariants}>
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
                sx={{ p: 0 }}
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
                transition: "opacity 0.15s ease",
                "&:hover": { opacity: 0.75 },
              }}
            >
              Forgot password?
            </Link>
          </Stack>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div whileTap={{ scale: loginMutation.isPending ? 1 : 0.98 }}>
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
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 20px -8px var(--mui-palette-primary-main, #2DD4BF)",
                },
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
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Divider />
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>
      </Stack>
    </motion.form>
  );
};

export default LoginForm;