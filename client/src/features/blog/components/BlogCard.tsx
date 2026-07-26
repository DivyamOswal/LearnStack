import { Link as RouterLink } from 'react-router-dom';
import { Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BlogListItem } from '../blog.types';
import { ROUTES } from '@/routes/routePaths';

const BlogCard = ({ blog }: { blog: BlogListItem }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <RouterLink
        to={ROUTES.BLOG_POST(blog.slug)}
        className="group flex flex-col overflow-hidden rounded-lg border no-underline text-inherit"
        style={{ borderColor: 'inherit', transition: 'border-color 0.2s ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--mui-palette-primary-main, #2DD4BF)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--mui-palette-divider, #30363D)')}
      >
        <div
          className="aspect-video w-full overflow-hidden"
          style={{ backgroundColor: 'var(--mui-palette-action-hover, #1c2128)' }}
        >
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

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar src={blog.author.avatarUrl ?? undefined} sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                {blog.author.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {blog.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                · {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="group-hover:opacity-100 group-hover:translate-x-0"
              style={{ opacity: 0, transform: 'translateX(-4px)', transition: 'opacity 0.2s ease, transform 0.2s ease' }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            </motion.div>
          </div>
        </div>
      </RouterLink>
    </motion.div>
  );
};

export default BlogCard;