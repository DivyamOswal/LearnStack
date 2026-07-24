import { useParams } from 'react-router-dom';
import { Typography, Avatar, CircularProgress } from '@mui/material';
import { useBlogBySlug } from '@/features/blog/blogApi';
import EmptyState from '@/components/ui/EmptyState';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogBySlug(slug ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !post) {
    return <EmptyState title="Post not found" description="This post may have been removed or unpublished." />;
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-10 sm:px-6 md:py-14">
      <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, mb: 3, lineHeight: 1.2 }}>
        {post.title}
      </Typography>

      <div className="flex items-center gap-2 mb-8 pb-8 border-b" style={{ borderColor: 'inherit' }}>
        <Avatar src={post.author.avatarUrl ?? undefined} sx={{ width: 32, height: 32 }}>
          {post.author.name.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{post.author.name}</Typography>
          <Typography variant="caption" color="text.secondary" className="font-mono-ui">
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </div>
      </div>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full rounded-lg mb-8 aspect-video object-cover" />
      )}

      <Typography component="div" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {post.content}
      </Typography>
    </article>
  );
};

export default BlogPostPage;