import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

type PasswordFieldProps = Omit<TextFieldProps, "type">;

const PasswordField = ({ slotProps, ...rest }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const existingInputSlotProps = slotProps?.input;
  const existingEndAdornment =
    typeof existingInputSlotProps === "object" && existingInputSlotProps !== null
      ? (existingInputSlotProps as { endAdornment?: React.ReactNode }).endAdornment
      : undefined;

  return (
    <TextField
      {...rest}
      type={showPassword ? "text" : "password"}
      slotProps={{
        ...slotProps,
        input: {
          ...(typeof existingInputSlotProps === "object" ? existingInputSlotProps : {}),
          endAdornment: (
            <>
              {existingEndAdornment}
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={handleTogglePassword}
                  onMouseDown={handleMouseDown}
                  tabIndex={-1}
                  sx={{ position: "relative", overflow: "hidden" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? "visible" : "hidden"}
                      initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: "flex" }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </IconButton>
              </InputAdornment>
            </>
          ),
        },
      }}
    />
  );
};

export default PasswordField;