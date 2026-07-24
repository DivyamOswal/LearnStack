import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { InputBase, IconButton, Paper, Typography, CircularProgress, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useGlobalSearch } from '../searchApi';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTES } from '@/routes/routePaths';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useGlobalSearch(debouncedQuery);
  const hasResults = data && (data.courses.length > 0 || data.lessons.length > 0 || data.instructors.length > 0);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSelect = (path: string) => {
    navigate(path);
    handleClose();
  };

  if (!open) {
    return (
      <IconButton size="small" onClick={() => setOpen(true)} aria-label="Search" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
        <SearchIcon fontSize="small" />
      </IconButton>
    );
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className="relative">
        <div
          className="flex items-center gap-2 px-3 rounded-md border"
          style={{ borderColor: 'inherit', backgroundColor: 'var(--mui-palette-action-hover, #1c2128)', width: 260, height: 36 }}
        >
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <InputBase
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, lessons..."
            className="font-mono-ui"
            sx={{ fontSize: '0.85rem', flexGrow: 1 }}
          />
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </div>

        {query.trim().length >= 2 && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: 44,
              right: 0,
              width: 340,
              maxHeight: 400,
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              zIndex: 10,
            }}
          >
            {isLoading && (
              <div className="flex justify-center py-6">
                <CircularProgress size={20} />
              </div>
            )}

            {!isLoading && !hasResults && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
                No results for "{query}"
              </Typography>
            )}

            {!isLoading && data?.courses && data.courses.length > 0 && (
              <div className="p-2">
                <Typography variant="caption" color="text.secondary" className="font-mono-ui" sx={{ px: 1 }}>courses</Typography>
                {data.courses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(ROUTES.COURSE_DETAIL(c.slug))}
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {c.thumbnailUrl && <img src={c.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />}
                    <Typography variant="body2">{c.title}</Typography>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && data?.lessons && data.lessons.length > 0 && (
              <div className="p-2 border-t" style={{ borderColor: 'inherit' }}>
                <Typography variant="caption" color="text.secondary" className="font-mono-ui" sx={{ px: 1 }}>lessons</Typography>
                {data.lessons.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => handleSelect(`/learn/${l.id}`)}
                    className="flex flex-col p-2 rounded-md cursor-pointer hover:opacity-80"
                  >
                    <Typography variant="body2">{l.title}</Typography>
                    <Typography variant="caption" color="text.secondary">in {l.chapter.course.title}</Typography>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && data?.instructors && data.instructors.length > 0 && (
              <div className="p-2 border-t" style={{ borderColor: 'inherit' }}>
                <Typography variant="caption" color="text.secondary" className="font-mono-ui" sx={{ px: 1 }}>instructors</Typography>
                {data.instructors.map((i) => (
                  <div key={i.id} className="flex items-center gap-2 p-2">
                    <Typography variant="body2">{i.name}</Typography>
                  </div>
                ))}
              </div>
            )}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;