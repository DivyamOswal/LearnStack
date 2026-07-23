import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Chip,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAdminCoupons, useCreateCoupon, useToggleCouponActive } from '@/features/admin/coupons/adminCouponApi';
import EmptyState from '@/components/ui/EmptyState';

const AdminCouponsPage = () => {
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const toggleActive = useToggleCouponActive();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCoupon.mutate(
      {
        code: code.toUpperCase(),
        discountPercent: parseInt(discountPercent, 10),
        maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          setCode('');
          setDiscountPercent('10');
          setMaxUses('');
          setExpiresAt('');
        },
      }
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ admin --coupons
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Manage coupons
      </Typography>

      <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-8 p-4 border rounded-md" style={{ borderColor: 'inherit' }}>
        {createCoupon.isError && (
          <Alert severity="error">
            {(createCoupon.error as any)?.response?.data?.message ?? 'Failed to create coupon.'}
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <TextField
            label="Coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            size="small"
            fullWidth
            required
            className="font-mono-ui"
          />
          <TextField
            label="Discount %"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            size="small"
            fullWidth
            required
            inputProps={{ min: 1, max: 100 }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <TextField
            label="Max uses (optional)"
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            size="small"
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Expires on (optional)"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          disabled={createCoupon.isPending}
          sx={{ alignSelf: 'flex-start' }}
        >
          {createCoupon.isPending ? 'Creating...' : 'Create coupon'}
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && coupons && coupons.length === 0 && (
        <EmptyState title="No coupons yet" description="Create your first coupon above." />
      )}

      {!isLoading && coupons && coupons.length > 0 && (
        <div className="flex flex-col gap-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex flex-wrap items-center gap-3 p-3 rounded-md border"
              style={{ borderColor: 'inherit' }}
            >
              <Typography className="font-mono-ui" sx={{ fontWeight: 700 }}>
                {coupon.code}
              </Typography>
              <Chip label={`${coupon.discountPercent}% off`} size="small" className="font-mono-ui" sx={{ bgcolor: 'action.hover' }} />
              <Typography variant="body2" color="text.secondary" className="font-mono-ui">
                {coupon.usedCount}/{coupon.maxUses ?? '∞'} used
              </Typography>
              {coupon.expiresAt && (
                <Typography variant="body2" color="text.secondary" className="font-mono-ui">
                  expires {new Date(coupon.expiresAt).toLocaleDateString()}
                </Typography>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Typography variant="body2" color="text.secondary">
                  {coupon.isActive ? 'active' : 'inactive'}
                </Typography>
                <Switch
                  checked={coupon.isActive}
                  onChange={() => toggleActive.mutate({ id: coupon.id, isActive: !coupon.isActive })}
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;