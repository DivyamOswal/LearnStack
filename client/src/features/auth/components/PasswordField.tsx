import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

type PasswordFieldProps = Omit<TextFieldProps, "type">;

const PasswordField = ({ InputProps, ...rest }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...rest}
      type={showPassword ? "text" : "password"}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {InputProps?.endAdornment}
            <InputAdornment position="end">
              <IconButton
                edge="end"
                size="small"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleTogglePassword}
                onMouseDown={handleMouseDown}
                tabIndex={-1}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          </>
        ),
      }}
    />
  );
};

export default PasswordField;
