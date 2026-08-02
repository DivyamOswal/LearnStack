import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Typography, CircularProgress, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useOrderStatus } from '@/features/payments/paymentsApi';
import { ROUTES } from '@/routes/routePaths';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const navigate = useNavigate();

  const { data, isLoading } = useOrderStatus(orderId, Boolean(orderId));

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      const timer = setTimeout(() => navigate(ROUTES.DASHBOARD), 1800);
      return () => clearTimeout(timer);
    }
  }, [data?.status, navigate]);

  if (!orderId) {
    return (
      <div className="flex flex-col items-center py-24 gap-3 text-center">
        <Typography color="text.secondary">Missing order reference.</Typography>
        <Button component={RouterLink} to={ROUTES.DASHBOARD} variant="outlined">
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
      {isLoading || data?.status === 'PENDING' ? (
        <>
          <CircularProgress size={40} />
          <Typography color="text.secondary">Confirming your payment...</Typography>
        </>
      ) : data?.status === 'COMPLETED' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
          <Typography variant="h4" sx={{ fontSize: '2rem' }}>✓</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Payment successful</Typography>
          <Typography color="text.secondary">
            You're enrolled in <strong>{data.courseTitle}</strong>. Redirecting to My Courses...
          </Typography>
        </motion.div>
      ) : (
        <>
          <Typography variant="h5" color="error.main" sx={{ fontWeight: 700 }}>Payment not confirmed</Typography>
          <Typography color="text.secondary">Something went wrong. Please contact support with your order ID: {orderId}</Typography>
          <Button component={RouterLink} to={ROUTES.DASHBOARD} variant="outlined">
            Go to dashboard
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccessPage;