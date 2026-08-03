import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useGoogleLogin } from "../authApi";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
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

import { motion, AnimatePresence, Variants } from "framer-motion";

import { ROUTES } from "@/routes/routePaths";
import { useRegister } from "../authApi";
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

const itemVariants: Variants = {
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

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

const strengthMeta = [
  { label: "", color: "divider" },
  { label: "Weak", color: "error.main" },
  { label: "Fair", color: "warning.main" },
  { label: "Good", color: "info.main" },
  { label: "Strong", color: "primary.main" },
];

const CheckmarkBurst = () => (
  <motion.svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <motion.circle
      cx="24"
      cy="24"
      r="21"
      stroke="var(--mui-palette-primary-main,#2DD4BF)"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />

    <motion.path
      d="M14 24.5L21 31.5L34 16"
      stroke="var(--mui-palette-primary-main,#2DD4BF)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.35,
      }}
    />
  </motion.svg>
);

const RegisterForm = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const googleLoginMutation = useGoogleLogin();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useRegister();

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutation.mutate({
      name,
      email,
      password,
    });
  };

  if (registerMutation.isSuccess) {
    return (
      <MotionPaper
        elevation={0}
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <CheckmarkBurst />

            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Verify your email
            </Typography>

            <Alert
              severity="success"
              sx={{
                width: "100%",
                borderRadius: 3,
              }}
            >
              We've sent a verification email to
              <strong> {email}</strong>.
              <br />
              Please verify your account before signing in.
            </Alert>

            <Link
              component={RouterLink}
              to={ROUTES.LOGIN}
              underline="hover"
              sx={{ fontWeight: 700 }}
            >
              Back to Sign In
            </Link>
          </Stack>
        </motion.div>
      </MotionPaper>
    );
  }
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
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
                  GET STARTED
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mt: 0.25,
                  }}
                >
                  Create LearnStack Account
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
              Join LearnStack to access premium courses,
              assessments, certificates and your learning dashboard.
            </Typography>
          </motion.div>

          <AnimatePresence>
            {registerMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: [0, -8, 8, -6, 6, -3, 3, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  {(registerMutation.error as any)?.response?.data?.message ??
                    "Registration failed. Please try again."}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label="Full Name"
                value={name}
                autoComplete="name"
                size="small"
                onChange={(e) => setName(e.target.value)}
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

              <TextField
                fullWidth
                required
                label="Email Address"
                type="email"
                autoComplete="email"
                value={email}
                size="small"
                onChange={(e) => setEmail(e.target.value)}
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

              <Stack spacing={1}>
                <PasswordField
                  label="Password"
                  value={password}
                  required
                  fullWidth
                  size="small"
                  autoComplete="new-password"
                  helperText="Minimum 8 characters, one uppercase letter and one number."
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 50,
                      borderRadius: 3,
                    },
                  }}
                />

                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Stack spacing={0.75}>
                        <Stack direction="row" spacing={0.75}>
                          {[1, 2, 3, 4].map((item) => (
                            <Box
                              key={item}
                              sx={{
                                flex: 1,
                                height: 6,
                                borderRadius: 99,
                                bgcolor:
                                  item <= strength
                                    ? strength === 1
                                      ? "error.main"
                                      : strength === 2
                                      ? "warning.main"
                                      : strength === 3
                                      ? "info.main"
                                      : "primary.main"
                                    : "divider",
                                transition: ".25s",
                              }}
                            />
                          ))}
                        </Stack>

                        <Typography
                          variant="caption"
                          sx={{
                            color: strengthMeta[strength].color,
                            fontWeight: 600,
                          }}
                        >
                          Password Strength : {strengthMeta[strength].label}
                        </Typography>
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Stack>
          </motion.div>
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
                disabled={registerMutation.isPending}
                startIcon={
                  registerMutation.isPending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{
                  height: 50,
                  borderRadius: 3,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  boxShadow: "0 12px 35px rgba(45,212,191,.35)",
                }}
              >
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider sx={{ my: -0.5 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 11 }}
              >
                START YOUR LEARNING JOURNEY
              </Typography>
            </Divider>
          </motion.div>

          <motion.div variants={itemVariants}>
  <Divider sx={{ my: -0.5 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontSize: 11 }}
    >
      OR CONTINUE WITH
    </Typography>
  </Divider>
</motion.div>

<motion.div variants={itemVariants}>
  <Stack direction="row" spacing={1.5}>
    <GoogleLogin
  onSuccess={(credentialResponse) => {
    if (!credentialResponse.credential) {
      return;
    }

    googleLoginMutation.mutate(
      {
        idToken: credentialResponse.credential,
      },
      {
        onSuccess: () => navigate(ROUTES.DASHBOARD),
      }
    );
  }}
  onError={() => {}}
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
            <Typography
              align="center"
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: 13 }}
            >
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to={ROUTES.LOGIN}
                sx={{ fontWeight: 700 }}
              >
                Sign In
              </Link>
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              align="center"
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 11,
              }}
            >
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </Typography>

            <Typography
              align="center"
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: 11,
              }}
            >
              © 2026 LearnStack · Secure authentication powered by JWT
            </Typography>
          </motion.div>
        </Stack>
      </motion.form>
    </MotionPaper>
  );
};

export default RegisterForm;