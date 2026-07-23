import { Outlet, Link as RouterLink } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import { ROUTES } from "@/routes/routePaths";

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        bgcolor: "background.default",
        backgroundImage:
          "radial-gradient(circle at top, rgba(45,212,191,0.08), transparent 55%)",
      }}
    >
      <Box
        component={RouterLink}
        to={ROUTES.HOME}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          textDecoration: "none",
          color: "text.primary",
          mb: 5,
        }}
      >
        <Typography
          component="span"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            fontSize: "1.2rem",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          $
        </Typography>

        <Typography
          component="span"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "1.85rem",
            letterSpacing: "-0.03em",
          }}
        >
          learnstack
        </Typography>

        <Box
          component="span"
          sx={{
            width: 8,
            height: 24,
            bgcolor: "primary.main",
            borderRadius: "2px",
            animation: "blink 1.1s steps(1) infinite",
            "@keyframes blink": {
              "0%,50%": {
                opacity: 1,
              },
              "51%,100%": {
                opacity: 0,
              },
            },
          }}
        />
      </Box>

      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 480,
          p: {
            xs: 4,
            sm: 5,
          },
          borderRadius: 4,
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        }}
      >
        <Outlet />
      </Paper>
    </Box>
  );
};

export default AuthLayout;
