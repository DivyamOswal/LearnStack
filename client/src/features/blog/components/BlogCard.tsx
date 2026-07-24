import { Link as RouterLink } from 'react-router-dom';
import { Typography, Avatar } from '@mui/material';
import { BlogListItem } from '../blog.types';
import { ROUTES } from '@/routes/routePaths';

const BlogCard = ({ blog }: { blog: BlogListItem }) => {
  return (
    <RouterLink
      to={ROUTES.BLOG_POST(blog.slug)}
      className="group flex flex-col overflow-hidden rounded-lg border no-underline text-inherit transition-transform hover:-translate-y-1"
      style={{ borderColor: 'inherit' }}
    >
      <div className="aspect-video w-full overflow-hidden" style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono-ui text-sm opacity-40">
            no_cover.png
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 }} className="line-clamp-2">
          {blog.title}
        </Typography>

        <div className="flex items-center gap-2 mt-1">
          <Avatar src={blog.author.avatarUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
            {blog.author.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="caption" color="text.secondary">{blog.author.name}</Typography>
          <Typography variant="caption" color="text.secondary" className="font-mono-ui">
            · {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>
        </div>
      </div>
    </RouterLink>
  );
};

export default BlogCard;