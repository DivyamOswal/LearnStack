import { Box, Stack, Typography, Chip } from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import LoginForm from "@/features/auth/components/LoginForm";
import ThreeBackground from "@/features/auth/components/ThreeBackground";

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          position: "relative",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid",
          borderColor: "divider",
          width: { lg: "58%" },
          flexShrink: 0,
        }}
      >
        <ThreeBackground />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.15), transparent)",
            zIndex: 2,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            maxWidth: 520,
            width: "100%",
            px: 6,
            color: "common.white",
          }}
        >
          <Chip
            icon={<SchoolRoundedIcon />}
            label="LearnStack "
            color="primary"
            sx={{ mb: 3 }}
          />

          <Typography
            variant="h2"
            sx={{ fontWeight: 800, lineHeight: 1.1, mb: 3 }}
          >
            Learn smarter.
            <br />
            Build faster.
          </Typography>

          <Typography sx={{ fontSize: 18, opacity: 0.9, mb: 5 }}>
            The modern learning platform for developers, students,
            and professionals.
          </Typography>

          <Stack spacing={2}>
            {[
              "Interactive coding lessons",
              "Real-time assessments",
              "Certificates & progress tracking",
            ].map((item) => (
              <Stack key={item} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <CheckCircleRoundedIcon color="success" />
                <Typography>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 6 },
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;