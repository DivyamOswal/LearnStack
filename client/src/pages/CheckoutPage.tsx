import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, CircularProgress, Alert, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { useCourseBySlug } from '@/features/courses/coursesApi';
import { usePreviewPricing, useCreateCheckoutSession } from '@/features/payments/paymentsApi';
import { formatCurrency } from '@/utils/formatCurrency';
import { useDebounce } from '@/hooks/useDebounce';

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useCourseBySlug(slug ?? '');

  const [couponCode, setCouponCode] = useState('');
  const debouncedCoupon = useDebounce(couponCode, 500);

  const previewPricing = usePreviewPricing();
  const createCheckout = useCreateCheckoutSession();

  useEffect(() => {
    if (!course) return;
    previewPricing.mutate({ courseId: course.id, couponCode: debouncedCoupon || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, debouncedCoupon]);

  const handlePay = () => {
    if (!course) return;
    createCheckout.mutate(
      { courseId: course.id, couponCode: debouncedCoupon || undefined },
      { onSuccess: (result) => { window.location.href = result.checkoutUrl; } }
    );
  };

  if (courseLoading || !course) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  const breakdown = previewPricing.data;

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <Typography variant="overline" color="primary.main">$ checkout --secure</Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Complete your enrollment
      </Typography>

      <div className="border rounded-lg p-6 flex flex-col gap-5" style={{ borderColor: 'inherit' }}>
        <div className="flex items-center gap-3">
          {course.thumbnailUrl && (
            <img src={course.thumbnailUrl} alt={course.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
          )}
          <div>
            <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
            <Typography variant="caption" color="text.secondary">{course.category.name}</Typography>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <TextField
            label="Coupon code (optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: <LocalOfferOutlinedIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />,
              },
            }}
          />
          <AnimatePresence>
            {previewPricing.isError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                  {(previewPricing.error as any)?.response?.data?.message ?? 'Invalid coupon.'}
                </Alert>
              </motion.div>
            )}
            {breakdown?.couponApplied && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                  Coupon "{breakdown.couponCode}" applied.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Divider />

        {previewPricing.isPending && !breakdown ? (
          <div className="flex justify-center py-4">
            <CircularProgress size={20} />
          </div>
        ) : breakdown ? (
          <div className="flex flex-col gap-2 font-mono-ui text-sm">
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Price</span>
              <span>{formatCurrency(breakdown.baseAmount)}</span>
            </div>
            {breakdown.discountAmount > 0 && (
              <div className="flex justify-between" style={{ color: 'var(--mui-palette-primary-main, #2DD4BF)' }}>
                <span>Course discount</span>
                <span>-{formatCurrency(breakdown.discountAmount)}</span>
              </div>
            )}
            {breakdown.couponApplied && (
              <div className="flex justify-between" style={{ color: 'var(--mui-palette-primary-main, #2DD4BF)' }}>
                <span>Coupon savings</span>
                <span>-{formatCurrency(breakdown.baseAmount - breakdown.discountAmount - breakdown.subtotal)}</span>
              </div>
            )}
            <div className="flex justify-between" style={{ opacity: 0.7 }}>
              <span>GST ({(breakdown.taxRate * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(breakdown.taxAmount)}</span>
            </div>
            <Divider sx={{ my: 1 }} />
            <div className="flex justify-between" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>{formatCurrency(breakdown.total)}</span>
            </div>
          </div>
        ) : null}

        {createCheckout.isError && (
          <Alert severity="error">
            {(createCheckout.error as any)?.response?.data?.message ?? 'Checkout failed. Please try again.'}
          </Alert>
        )}

        <motion.div whileTap={{ scale: createCheckout.isPending ? 1 : 0.98 }}>
          <Button
            variant="contained"
            disableElevation
            size="large"
            fullWidth
            onClick={handlePay}
            disabled={!breakdown || createCheckout.isPending || previewPricing.isPending}
          >
            {createCheckout.isPending ? 'Redirecting to payment...' : `Pay ${breakdown ? formatCurrency(breakdown.total) : ''}`}
          </Button>
        </motion.div>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Payments are processed securely by Stripe.
        </Typography>
      </div>
    </div>
  );
};

export default CheckoutPage;