import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Chip,
  Switch,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { useAdminCoupons, useCreateCoupon, useToggleCouponActive } from '@/features/admin/coupons/adminCouponApi';
import EmptyState from '@/components/ui/EmptyState';

const glassPanel = {
  bgcolor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 3,
  backdropFilter: 'blur(12px)',
};

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
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Typography variant="overline" color="primary.main" className="font-mono-ui">
        $ admin --coupons
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
        Manage coupons
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
        Create discount codes and toggle their availability.
      </Typography>

      {/* Create coupon panel */}
      <form
        onSubmit={handleCreate}
        style={glassPanel}
        className="flex flex-col gap-4 mb-10 p-5 relative overflow-hidden"
      >
        {/* accent glow */}
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)' }}
        />

        <Typography
          variant="caption"
          className="font-mono-ui"
          sx={{ color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase' }}
        >
          New coupon
        </Typography>

        {createCoupon.isError && (
          <Alert severity="error" sx={{ bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PercentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          disabled={createCoupon.isPending}
          sx={{
            alignSelf: 'flex-start',
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {createCoupon.isPending ? 'Creating...' : 'Create coupon'}
        </Button>
      </form>

      {/* Coupon list */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && coupons && coupons.length === 0 && (
        <EmptyState title="No coupons yet" description="Create your first coupon above." />
      )}

      {!isLoading && coupons && coupons.length > 0 && (
        <div className="flex flex-col gap-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              style={glassPanel}
              className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/5"
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 44,
                  height: 44,
                  background: coupon.isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${coupon.isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <LocalOfferOutlinedIcon
                  sx={{ fontSize: 20, color: coupon.isActive ? 'primary.main' : 'text.disabled' }}
                />
              </div>

              <div className="flex flex-col gap-0.5 min-w-[140px]">
                <Typography className="font-mono-ui" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  {coupon.code}
                </Typography>
                <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                  {coupon.usedCount}/{coupon.maxUses ?? '∞'} used
                </Typography>
              </div>

              <Chip
                label={`${coupon.discountPercent}% OFF`}
                size="small"
                className="font-mono-ui"
                sx={{
                  bgcolor: 'rgba(99,102,241,0.12)',
                  color: 'primary.main',
                  fontWeight: 700,
                  border: '1px solid rgba(99,102,241,0.25)',
                }}
              />

              {coupon.expiresAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className="font-mono-ui"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <EventOutlinedIcon sx={{ fontSize: 14 }} />
                  expires {new Date(coupon.expiresAt).toLocaleDateString()}
                </Typography>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <Chip
                  label={coupon.isActive ? 'active' : 'inactive'}
                  size="small"
                  className="font-mono-ui"
                  sx={{
                    bgcolor: coupon.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                    color: coupon.isActive ? '#4ade80' : 'text.secondary',
                    border: `1px solid ${coupon.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    fontWeight: 600,
                  }}
                />
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