import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { BlogListItem } from "../blog.types";
import { ROUTES } from "@/routes/routePaths";

const MotionBox = motion(Box);

interface Props {
  blog: BlogListItem;
}

const BlogCard = ({ blog }: Props) => {
  // Derive a fake "filename" from the slug — reinforces the editor-tab motif
  // using data that's actually real (the post's real slug), not invented.
  const fileName = `${blog.slug.slice(0, 28)}${blog.slug.length > 28 ? '…' : ''}.md`;

  return (
    <MotionBox
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      sx={{ height: "100%" }}
    >
      <RouterLink
        to={ROUTES.BLOG_POST(blog.slug)}
        style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
      >
        <Box
          className="group"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "border-color 0.2s ease",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          {/* Editor-tab header — filename styled like an open file tab */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
            <Typography
              className="font-mono-ui"
              sx={{ fontSize: "0.72rem", color: "text.secondary", flexGrow: 1 }}
              noWrap
            >
              {fileName}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                <Box key={c} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c, opacity: 0.6 }} />
              ))}
            </Box>
          </Box>

          {/* Cover image — the "file content" */}
          <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: "16 / 9", bgcolor: "action.hover" }}>
            {blog.coverImage ? (
              <Box
                component="img"
                src={blog.coverImage}
                alt={blog.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.35s ease",
                  ".group:hover &": { transform: "scale(1.05)" },
                }}
              />
            ) : (
              <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography className="font-mono-ui" color="text.secondary" sx={{ opacity: 0.4, fontSize: "0.8rem" }}>
                  # no cover image
                </Typography>
              </Box>
            )}
          </Box>

          {/* Content */}
          <Stack spacing={1.5} sx={{ p: 3, flex: 1 }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {blog.title}
            </Typography>

            {/* Git-commit-styled footer: author as "committer", date as timestamp */}
            <Box
              sx={{
                mt: "auto",
                pt: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                <Avatar
                  src={blog.author?.avatarUrl ?? undefined}
                  sx={{ width: 24, height: 24, bgcolor: "primary.main", fontSize: "0.7rem", fontWeight: 700 }}
                >
                  {(blog.author?.name ?? "A").charAt(0).toUpperCase()}
                </Avatar>
                <Typography className="font-mono-ui" variant="caption" color="text.secondary" noWrap>
                  {blog.author?.name ?? "anonymous"} ·{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                  transition: "transform 0.2s ease",
                  ".group:hover &": { transform: "translateX(3px)" },
                  flexShrink: 0,
                }}
              >
                <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          </Stack>
        </Box>
      </RouterLink>
    </MotionBox>
  );
};

export default BlogCard;