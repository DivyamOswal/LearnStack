import { Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  label: string;
  value: number;
  icon: SvgIconComponent;
}

const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <div className="flex items-center gap-4 p-5 rounded-lg border" style={{ borderColor: 'inherit' }}>
    <div
      className="flex items-center justify-center rounded-md shrink-0"
      style={{ width: 44, height: 44, backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
    >
      <Icon sx={{ color: 'primary.main', fontSize: 22 }} />
    </div>
    <div>
      <Typography className="font-mono-ui" sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </div>
  </div>
);

export default StatCard;