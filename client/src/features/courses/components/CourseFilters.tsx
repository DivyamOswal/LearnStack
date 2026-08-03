import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const CourseFilters = ({ search, onSearchChange }: CourseFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <TextField
        placeholder="Search courses..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        fullWidth
        className="font-mono-ui"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          maxWidth: { sm: 360 },
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: 2,
            transition: 'border-color 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99,102,241,0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(99,102,241,0.6)',
              borderWidth: 1,
            },
          },
        }}
      />
    </div>
  );
};

export default CourseFilters;