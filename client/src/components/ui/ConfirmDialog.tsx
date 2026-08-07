import { forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { motion } from 'framer-motion';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}
<<<<<<< HEAD

=======
>>>>>>> 2611be9be143277aa428f455a68e1d266b30e0b3
// Custom transition: MUI's Dialog accepts a slots.transition override -swapping in
// Framer Motion here gives a spring-based scale+fade instead of MUI's default
// linear fade, matching the motion language used across the rest of the app.
const SpringTransition = forwardRef(function SpringTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  const { children, in: inProp, ...other } = props;
  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={inProp ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      {...(other as any)}
    >
      {children}
    </motion.div>
  );
});
const ConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slots={{ transition: SpringTransition }}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.55)' } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: isDestructive ? 'error.main' : 'primary.main',
            opacity: 0.15,
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: isDestructive ? 'error.main' : 'primary.main',
            color: '#fff',
          }}
        >
          {isDestructive ? (
            <WarningAmberOutlinedIcon fontSize="small" />
          ) : (
            <HelpOutlineOutlinedIcon fontSize="small" />
          )}
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <motion.div whileTap={{ scale: isLoading ? 1 : 0.96 }}>
          <Button
            onClick={onConfirm}
            variant="contained"
            disableElevation
            color={isDestructive ? 'error' : 'primary'}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{ minWidth: 96 }}
          >
            {isLoading ? 'Please wait' : confirmLabel}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
