import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { motion, AnimatePresence } from "framer-motion";

import { ROUTES } from "@/routes/routePaths";
import { useLogin, useGoogleLogin } from "../authApi";
import PasswordField from "./PasswordField";

const MotionPaper = motion(Paper);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const LoginForm = () => {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    ROUTES.DASHBOARD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      {
        email,
        password,
        rememberMe,
      },
      {
        onSuccess: () =>
          navigate(from, {
            replace: true,
          }),

        onError: () => setShakeKey((k) => k + 1),
      }
    );
  };

  const isFormError = loginMutation.isError || googleLoginMutation.isError;
  const errorMessage =
    (loginMutation.error as any)?.response?.data?.message ??
    (googleLoginMutation.error as any)?.response?.data?.message ??
    "Invalid email or password.";

  return (
    <MotionPaper
      elevation={0}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        p: {
          xs: 3,
          md: 4,
        },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        backdropFilter: "blur(30px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 25px 80px rgba(0,0,0,.45)"
            : "0 25px 80px rgba(15,23,42,.08)",
      }}
    >
      <motion.form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.25}>
          <motion.div variants={itemVariants}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "primary.main",
                }}
              >
                <SchoolRoundedIcon fontSize="small" />
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  WELCOME BACK
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mt: 0.25,
                  }}
                >
                  Sign in to LearnStack
                </Typography>
              </Box>
            </Stack>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Continue learning where you left off  access your courses,
              assessments, and dashboard.
            </Typography>
          </motion.div>

          {/* ---------------- ERROR ---------------- */}

          <AnimatePresence>
            {isFormError && (
              <motion.div
                key={shakeKey}
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: [0, -8, 8, -6, 6, -3, 3, 0],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    borderRadius: 3,
                    py: 0.25,
                  }}
                >
                  {errorMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- EMAIL + PASSWORD ---------------- */}

          <motion.div variants={itemVariants}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 3,
                    transition: ".25s",
                    "&:hover": {
                      transform: "translateY(-1px)",
                    },
                  },
                }}
              />

              <PasswordField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 3,
                  },
                }}
              />
            </Stack>
          </motion.div>

          {/* ---------------- REMEMBER ---------------- */}

          <motion.div variants={itemVariants}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ p: 0.5 }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: 13,
                  }}
                >
                  Remember me
                </Typography>
              </Stack>

              <Link
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                underline="hover"
                fontWeight={600}
                sx={{ fontSize: 13 }}
              >
                Forgot password?
              </Link>
            </Stack>
          </motion.div>

          {/* ---------------- LOGIN BUTTON ---------------- */}

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <Button
                fullWidth
                type="submit"
                size="large"
                variant="contained"
                disableElevation
                disabled={loginMutation.isPending}
                sx={{
                  height: 50,
                  borderRadius: 3,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  boxShadow: "0 12px 35px rgba(45,212,191,.35)",
                }}
                startIcon={
                  loginMutation.isPending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider sx={{ my: -0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                OR CONTINUE WITH
              </Typography>
            </Divider>
          </motion.div>

          {/* ---------------- SOCIAL (side by side to save vertical space) ---------------- */}

          <motion.div variants={itemVariants}>
            <Stack direction="row" spacing={1.5}>
              <GoogleLogin
  onSuccess={(credentialResponse) => {
    if (!credentialResponse.credential) {
      setShakeKey((k) => k + 1);
      return;
    }

    googleLoginMutation.mutate(
      {
        idToken: credentialResponse.credential,
      },
      {
        onSuccess: () =>
          navigate(from, {
            replace: true,
          }),
        onError: () => setShakeKey((k) => k + 1),
      }
    );
  }}
  onError={() => setShakeKey((k) => k + 1)}
/>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon fontSize="small" />}
                disabled
                sx={{
                  height: 46,
                  borderRadius: 3,
                  fontSize: 13,
                }}
              >
                GitHub
              </Button>
            </Stack>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Stack spacing={0.25}>
              <Typography align="center" variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Don't have an account?{" "}
                <Link component={RouterLink} to={ROUTES.REGISTER} fontWeight={700}>
                  Create one
                </Link>
              </Typography>

              <Typography align="center" variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                © 2026 LearnStack · Secure authentication powered by JWT
              </Typography>
            </Stack>
          </motion.div>
        </Stack>
      </motion.form>
    </MotionPaper>
  );
};

export default LoginForm;