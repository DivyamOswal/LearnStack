import { useState } from 'react';
import { Typography, Switch, IconButton, Chip, CircularProgress, Pagination } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useAdminBlogs, useDeleteBlog, useTogglePublishBlog } from '@/features/blog/blogApi';
import BlogEditor from '@/features/admin/components/blog/BlogEditor';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const AdminBlogPage = () => {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const { data, isLoading } = useAdminBlogs(page);
  const deleteBlog = useDeleteBlog();
  const togglePublish = useTogglePublishBlog();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <Typography variant="overline" color="primary.main">$ admin --blog</Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Manage blog
      </Typography>

      <div className="mb-10 p-5 border rounded-lg" style={{ borderColor: 'inherit' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>New post</Typography>
        <BlogEditor />
      </div>

      <Typography variant="h6" sx={{ mb: 3 }}>All posts</Typography>

      {isLoading && (
        <div className="flex justify-center py-16">
          <CircularProgress />
        </div>
      )}

      {!isLoading && data && data.blogs.length === 0 && (
        <EmptyState title="No posts yet" description="Create your first post above." />
      )}

      {!isLoading && data && data.blogs.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {data.blogs.map((blog) => (
              <div key={blog.id} className="flex items-center gap-3 p-3 rounded-md border flex-wrap" style={{ borderColor: 'inherit' }}>
                <Typography sx={{ flexGrow: 1, fontWeight: 500, minWidth: 200 }}>{blog.title}</Typography>
                <Chip
                  label={blog.isPublished ? 'published' : 'draft'}
                  size="small"
                  className="font-mono-ui"
                  color={blog.isPublished ? 'success' : 'default'}
                  variant={blog.isPublished ? 'filled' : 'outlined'}
                />
                <Switch
                  checked={blog.isPublished}
                  onChange={() => togglePublish.mutate({ id: blog.id, isPublished: !blog.isPublished })}
                  size="small"
                />
                <IconButton size="small" color="error" onClick={() => setDeleteTarget({ id: blog.id, title: blog.title })}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination count={data.totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete post?"
        description={`This will permanently delete "${deleteTarget?.title}".`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteBlog.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteBlog.isPending}
      />
    </div>
  );
};

export default AdminBlogPage;