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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: { sm: 360 } }}
      />
    </div>
  );
};

export default CourseFilters;