import { Typography, Rating } from '@mui/material';
import { RatingDistribution } from '../review.types';

interface RatingDistributionChartProps {
  distribution: RatingDistribution;
  averageRating: number;
  ratingCount: number;
}

const RatingDistributionChart = ({ distribution, averageRating, ratingCount }: RatingDistributionChartProps) => {
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col items-center gap-1 sm:min-w-32">
        <Typography className="font-mono-ui" sx={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
          {averageRating.toFixed(1)}
        </Typography>
        <Rating value={averageRating} precision={0.1} readOnly size="small" />
        <Typography variant="caption" color="text.secondary" className="font-mono-ui">
          {ratingCount} ratings
        </Typography>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 w-full">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star as keyof RatingDistribution];
          const widthPercent = (count / maxCount) * 100;
          return (
            <div key={star} className="flex items-center gap-2">
              <Typography variant="caption" className="font-mono-ui" sx={{ width: 12 }}>
                {star}
              </Typography>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${widthPercent}%`, backgroundColor: 'var(--mui-palette-primary-main, #2DD4BF)' }}
                />
              </div>
              <Typography variant="caption" color="text.secondary" sx={{ width: 24, textAlign: 'right' }}>
                {count}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingDistributionChart;