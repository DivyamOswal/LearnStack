import { Paper, PaperProps, useTheme } from "@mui/material";

interface Props extends PaperProps {}

const AuthCard = ({ children, sx, ...props }: Props) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      {...props}
      sx={{
        width: "100%",
        maxWidth: 480,

        p: {
          xs: 4,
          md: 5,
        },

        borderRadius: 6,

        overflow: "hidden",

        border: "1px solid",

        borderColor: "divider",

        backdropFilter: "blur(40px)",

        background:
          theme.palette.mode === "dark"
            ? "rgba(20,20,24,.82)"
            : "rgba(255,255,255,.82)",

        boxShadow:
          theme.palette.mode === "dark"
            ? "0 30px 80px rgba(0,0,0,.45)"
            : "0 30px 80px rgba(15,23,42,.10)",

        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default AuthCard;