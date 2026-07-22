import { useState } from 'react';
import { Typography, CircularProgress, Pagination } from '@mui/material';
import { useCourseList } from '@/features/courses/coursesApi';
import CourseCard from '@/features/courses/components/CourseCard';
import CourseFilters from '@/features/courses/components/CourseFilters';
import EmptyState from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';

const CourseListPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError } = useCourseList({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 md:px-8 md:py-14">
      <Typography variant="overline" color="primary.main">
        $ ls courses/
      </Typography>
      <Typography variant="h3" sx={{ mt: 1, mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        All courses
      </Typography>

      <div className="mb-8">
        <CourseFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <EmptyState title="Something went wrong" description="Couldn't load courses. Please try again shortly." />
      )}

      {!isLoading && !isError && data && data.courses.length === 0 && (
        <EmptyState title="No courses found" description="Try a different search term or check back later." />
      )}

      {!isLoading && data && data.courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseListPage;