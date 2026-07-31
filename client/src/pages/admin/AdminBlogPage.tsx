import { useState } from 'react';
import { Typography, Switch, IconButton, Chip, CircularProgress, Pagination, Box } from '@mui/material';
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      <Typography variant="overline" color="primary.main">$ admin --blog</Typography>
      <Typography variant="h5" sx={{ mt: 0.5, mb: 3, fontWeight: 700 }}>
        Manage blog
      </Typography>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" style={{ height: 'calc(100% - 60px)' }}>
        {/* Left: editor, own scroll if content genuinely overflows on small viewports */}
        <Box sx={{ overflowY: 'auto', pr: 1 }}>
          <BlogEditor />
        </Box>

        {/* Right: existing posts list, independently scrollable */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, flexShrink: 0 }}>
            All posts
          </Typography>

          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            {isLoading && (
              <div className="flex justify-center py-10">
                <CircularProgress size={24} />
              </div>
            )}

            {!isLoading && data && data.blogs.length === 0 && (
              <EmptyState title="No posts yet" description="Create your first post on the left." />
            )}

            {!isLoading && data && data.blogs.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  {data.blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center gap-2 p-2.5 rounded-md border flex-wrap"
                      style={{ borderColor: 'inherit' }}
                    >
                      <Typography sx={{ flexGrow: 1, fontWeight: 500, fontSize: '0.9rem', minWidth: 140 }} noWrap>
                        {blog.title}
                      </Typography>
                      <Chip
                        label={blog.isPublished ? 'published' : 'draft'}
                        size="small"
                        className="font-mono-ui"
                        color={blog.isPublished ? 'success' : 'default'}
                        variant={blog.isPublished ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.65rem', height: 22 }}
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
                  <div className="flex justify-center mt-4">
                    <Pagination
                      count={data.totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      shape="rounded"
                      size="small"
                    />
                  </div>
                )}
              </>
            )}
          </Box>
        </Box>
      </div>

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