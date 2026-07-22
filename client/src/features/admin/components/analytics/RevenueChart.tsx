import { useTheme } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MonthlyRevenue } from '../../adminDashboard.types';

const RevenueChart = ({ data }: { data: MonthlyRevenue[] }) => {
  const theme = useTheme();

  return (
    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'inherit' }}>
      <p className="font-mono-ui text-sm mb-4" style={{ color: theme.palette.text.secondary }}>
        $ revenue --last=12mo
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.25} />
              <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;