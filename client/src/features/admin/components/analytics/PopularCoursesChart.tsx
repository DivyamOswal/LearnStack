import { useTheme } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PopularCourse } from '../../adminDashboard.types';

const PopularCoursesChart = ({ data }: { data: PopularCourse[] }) => {
  const theme = useTheme();
  const chartData = data.map((c) => ({ ...c, shortTitle: c.title.length > 18 ? `${c.title.slice(0, 18)}…` : c.title }));

  return (
    <div className="border rounded-lg p-4 sm:p-6" style={{ borderColor: 'inherit' }}>
      <p className="font-mono-ui text-sm mb-4" style={{ color: theme.palette.text.secondary }}>
        $ top --courses --by=enrollments
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="shortTitle"
            width={140}
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="enrollments" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularCoursesChart;