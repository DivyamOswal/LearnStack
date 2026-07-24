import { useState } from 'react';
import { Typography, CircularProgress, Pagination } from '@mui/material';
import { usePublicBlogs } from '@/features/blog/blogApi';
import BlogCard from '@/features/blog/components/BlogCard';
import EmptyState from '@/components/ui/EmptyState';

const BlogListPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePublicBlogs(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 md:px-8 md:py-14">
      <Typography variant="overline" color="primary.main">$ ls blog/</Typography>
      <Typography variant="h3" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        From the blog
      </Typography>

      {isLoading && (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.blogs.length === 0 && (
        <EmptyState title="No posts yet" description="Check back soon." />
      )}

      {!isLoading && data && data.blogs.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination count={data.totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogListPage;