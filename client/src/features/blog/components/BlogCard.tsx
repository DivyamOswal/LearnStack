import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { BlogListItem } from "../blog.types";
import { ROUTES } from "@/routes/routePaths";

const MotionBox = motion(Box);

interface Props {
  blog: BlogListItem;
}

const BlogCard = ({ blog }: Props) => {
  return (
    <MotionBox
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      sx={{ height: "100%" }}
    >
      <RouterLink
        to={ROUTES.BLOG_POST(blog.slug)}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          height: "100%",
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all .3s ease",
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: "0 30px 70px rgba(45,212,191,.18)",
            },
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              aspectRatio: "16 / 9",
            }}
          >
            {blog.coverImage ? (
              <motion.img
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
                src={blog.coverImage}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  No Cover Image
                </Typography>
              </Box>
            )}

            {/* Gradient */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.75), transparent 60%)",
              }}
            />

            {/* Chips */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
              }}
            >
              <Chip
                label="Article"
                size="small"
                color="primary"
                sx={{
                  backdropFilter: "blur(10px)",
                  fontWeight: 600,
                }}
              />

              <Chip
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
                label="5 min"
                size="small"
                sx={{
                  bgcolor: "rgba(0,0,0,.55)",
                  color: "#fff",
                }}
              />
            </Stack>
          </Box>

          {/* Content */}
          <Stack
            spacing={2}
            sx={{
              p: 3,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: 800,
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 64,
              }}
            >
              {blog.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                lineHeight: 1.75,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 72,
              }}
            >
              {blog.excerpt ??
                "Explore practical tutorials, guides, and best practices to improve your development skills."}
            </Typography>

            <Divider />
                        {/* Footer */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mt: "auto",
              }}
            >
              {/* Author */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Avatar
                  src={blog.author?.avatarUrl ?? undefined}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "primary.main",
                    fontWeight: 700,
                  }}
                >
                  {(blog.author?.name ?? "A")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    fontWeight={700}
                    fontSize={14}
                  >
                    {blog.author?.name ?? "Anonymous"}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                  >
                    <CalendarTodayRoundedIcon
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(
                        blog.createdAt
                      ).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* CTA */}
              <motion.div
                whileHover={{
                  x: 5,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: ".2s",

                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize={14}
                  >
                    Read
                  </Typography>

                  <ArrowForwardRoundedIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </Stack>
              </motion.div>
            </Stack>
          </Stack>
        </Box>
      </RouterLink>
    </MotionBox>
  );
};

export default BlogCard;