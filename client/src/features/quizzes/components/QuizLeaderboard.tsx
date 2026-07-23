import { Typography, Avatar, Chip } from '@mui/material';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { LeaderboardEntry } from '../quiz.types';

const QuizLeaderboard = ({ entries }: { entries: LeaderboardEntry[] }) => {
  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto">
      <Typography variant="overline" color="primary.main" className="text-center block">
        $ leaderboard --top=10
      </Typography>

      {entries.map((entry, index) => (
        <div
          key={entry.userId}
          className="flex items-center gap-3 p-3 rounded-md border"
          style={{ borderColor: 'inherit', backgroundColor: index < 3 ? 'var(--mui-palette-action-hover, #1c2128)' : undefined }}
        >
          <Typography className="font-mono-ui" sx={{ minWidth: 24, color: index < 3 ? 'primary.main' : 'text.secondary', fontWeight: 700 }}>
            {index + 1}
          </Typography>
          <Avatar src={entry.user.avatarUrl ?? undefined} sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
            {entry.user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: index < 3 ? 600 : 400 }}>
            {entry.user.name}
          </Typography>
          {index === 0 && <EmojiEventsOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
          <Chip label={`${entry.score}%`} size="small" className="font-mono-ui" color={entry.passed ? 'success' : 'default'} />
        </div>
      ))}
    </div>
  );
};

export default QuizLeaderboard;