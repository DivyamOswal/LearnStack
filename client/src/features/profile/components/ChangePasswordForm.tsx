import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";
import { useLogout } from "@/features/auth/authApi";
import { useChangePassword } from "../profileApi";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);

  const navigate = useNavigate();
  const changePassword = useChangePassword();
  const logout = useLogout();

  const checks = useMemo(() => ({
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  }), [newPassword, confirmPassword]);

  const score = [checks.length, checks.upper, checks.number, checks.match].filter(Boolean).length;
  const progress = score * 25;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMismatchError(true);
      return;
    }
    setMismatchError(false);

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            logout.mutate(undefined, {
              onSuccess: () => navigate(ROUTES.LOGIN),
            });
          }, 1500);
        },
      }
    );
  };

  if (changePassword.isSuccess) {
    return (
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2} alignItems="center">
          <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h5" fontWeight={700}>Password Changed</Typography>
          <Alert severity="success" sx={{ width: "100%" }}>
            Your password was updated successfully. You'll be logged out in a moment for security.
          </Alert>
        </Stack>
      </Paper>
    );
  }

  const field = (label:string,value:string,setter:any,show:boolean,setShow:any)=>(
    <TextField
      label={label}
      type={show?"text":"password"}
      value={value}
      onChange={(e)=>{
        setter(e.target.value);
        if(mismatchError) setMismatchError(false);
      }}
      fullWidth
      required
      InputProps={{
        endAdornment:(
          <InputAdornment position="end">
            <IconButton onClick={()=>setShow(!show)} edge="end">
              {show?<VisibilityOffOutlinedIcon/>:<VisibilityOutlinedIcon/>}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        maxWidth: 650,
        p: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Change Password
            </Typography>
            <Typography color="text.secondary">
              Update your password to keep your account secure.
            </Typography>
          </Box>
        </Stack>

        {changePassword.isError && (
          <Alert severity="error">
            {(changePassword.error as any)?.response?.data?.message ??
              "Failed to change password."}
          </Alert>
        )}

        {mismatchError && (
          <Alert severity="warning">
            New password and confirmation password do not match.
          </Alert>
        )}

        {field("Current Password",currentPassword,setCurrentPassword,showCurrent,setShowCurrent)}
        {field("New Password",newPassword,setNewPassword,showNew,setShowNew)}
        {field("Confirm New Password",confirmPassword,setConfirmPassword,showConfirm,setShowConfirm)}

        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Password Strength
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 10 }} />
          <Stack mt={2} spacing={0.5}>
            <Typography color={checks.length?"success.main":"text.secondary"}>✓ At least 8 characters</Typography>
            <Typography color={checks.upper?"success.main":"text.secondary"}>✓ One uppercase letter</Typography>
            <Typography color={checks.number?"success.main":"text.secondary"}>✓ One number</Typography>
            <Typography color={checks.match?"success.main":"text.secondary"}>✓ Passwords match</Typography>
          </Stack>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={changePassword.isPending}
          sx={{ py: 1.5, borderRadius: 2 }}
          startIcon={
            changePassword.isPending ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />
          }
        >
          {changePassword.isPending ? "Updating Password..." : "Change Password"}
        </Button>
      </Stack>
    </Paper>
  );
}