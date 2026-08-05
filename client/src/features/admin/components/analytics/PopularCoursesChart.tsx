import { useState } from 'react';
import { useTheme, Box, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { PopularCourse } from '../../adminDashboard.types';

const RANK_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

type ChartDatum = PopularCourse & { shortTitle: string; rank: string };

// Terminal-style tooltip  reads like a single line of command output,
// consistent with the "$ top --courses" framing above the chart.
const TerminalTooltip = ({ active, payload }: any) => {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  const datum: ChartDatum = payload[0].payload;

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        px: 1.5,
        py: 1,
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 12,
        boxShadow: 3,
      }}
    >
      <Box component="span" sx={{ color: theme.palette.primary.main }}>
        {datum.rank}
      </Box>{' '}
      <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
        {datum.title}
      </Box>
      <Box sx={{ color: theme.palette.text.secondary, mt: 0.25 }}>
        enrollments = {datum.enrollments.toLocaleString()}
      </Box>
    </Box>
  );
};

const PopularCoursesChart = ({ data }: { data: PopularCourse[] }) => {
  const theme = useTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData: ChartDatum[] = data.map((c, i) => ({
    ...c,
    shortTitle: c.title.length > 18 ? `${c.title.slice(0, 18)}…` : c.title,
    rank: RANK_LABELS[i] ?? String(i + 1).padStart(2, '0'),
  }));

  return (
    <div
      className="border rounded-lg p-4 sm:p-6"
      style={{ borderColor: theme.palette.divider }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <p className="font-mono-ui text-sm" style={{ color: theme.palette.text.secondary }}>
          <Box component="span" sx={{ color: theme.palette.success.main }}>
            $
          </Box>{' '}
          top --courses --by=enrollments
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '7px',
              height: '13px',
              bgcolor: theme.palette.text.secondary,
              ml: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 1.1s steps(1) infinite',
              '@keyframes blink': {
                '50%': { opacity: 0 },
              },
            }}
          />
        </p>
        <Typography className="font-mono-ui" variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {chartData.length} results
        </Typography>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 28, left: 0, bottom: 0 }}
          onMouseMove={(state) => {
            const index = state?.activeTooltipIndex;
            setHoverIndex(index === undefined || index === null ? null : Number(index));
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: theme.palette.text.secondary, fontFamily: 'var(--font-mono, monospace)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortTitle"
            width={150}
            axisLine={false}
            tickLine={false}
            tick={(props) => {
              const { x, y, payload, index } = props;
              const isActive = hoverIndex === index;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={-4}
                    y={0}
                    dy={4}
                    textAnchor="end"
                    fontSize={11}
                    fontFamily="var(--font-mono, monospace)"
                    fill={isActive ? theme.palette.primary.main : theme.palette.text.secondary}
                  >
                    <tspan fill={theme.palette.text.disabled}>{chartData[index]?.rank}</tspan>
                    {'  '}
                    {payload.value}
                  </text>
                </g>
              );
            }}
          />
          <Tooltip content={<TerminalTooltip />} cursor={{ fill: theme.palette.action.hover }} />
          <Bar dataKey="enrollments" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={hoverIndex === index ? theme.palette.primary.dark : theme.palette.primary.main}
                style={{ transition: 'fill 0.15s ease' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularCoursesChart;
