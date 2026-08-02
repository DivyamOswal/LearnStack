import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ROUTES } from '@/routes/routePaths';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
      <CancelOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Typography variant="h5" fontWeight={700}>Checkout cancelled</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
        No charge was made. You can try again anytime from the course page.
      </Typography>
      <div className="flex gap-3 mt-2">
        <Button component={RouterLink} to={ROUTES.COURSES} variant="outlined">
          Browse courses
        </Button>
        <Button component={RouterLink} to={ROUTES.DASHBOARD} variant="contained" disableElevation>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancelPage;