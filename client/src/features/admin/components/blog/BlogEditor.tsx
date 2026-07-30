import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

import { useCreateBlog } from "../../../blog/blogApi";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const createBlog = useCreateBlog();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBlog.mutate(
      {
        input: {
          title,
          content,
          isPublished,
        },
        coverImage: coverImage ?? undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setIsPublished(false);
          setCoverImage(null);
        },
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          p: 3,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <ArticleOutlinedIcon color="primary" sx={{ fontSize: 34 }} />

          <Box>
            <Typography variant="h5" fontWeight={700}>
              Create New Blog
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Write and publish articles for your audience.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card elevation={0}>
        <CardContent>

          {createBlog.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to create post.
            </Alert>
          )}

          {createBlog.isSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Post created successfully.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Title */}

              <TextField
                label="Blog Title"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />

              {/* Content */}

              <TextField
                label="Blog Content"
                placeholder="Start writing here..."
                multiline
                rows={12}
                fullWidth
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                helperText={`${content.length} characters`}
              />

              {/* Upload */}

              <Box>
                <Typography
                  fontWeight={600}
                  mb={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <ImageOutlinedIcon fontSize="small" />
                  Cover Image
                </Typography>

                <Button
                  component="label"
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    py: 4,
                    borderRadius: 3,
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <CloudUploadOutlinedIcon fontSize="large" />

                    <Typography fontWeight={600}>
                      {coverImage
                        ? coverImage.name
                        : "Click to upload cover image"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG, WEBP
                    </Typography>
                  </Stack>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCoverImage(e.target.files?.[0] ?? null)
                    }
                  />
                </Button>
              </Box>

              <Divider />

              {/* Publish */}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(e) =>
                        setIsPublished(e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box>
                      <Typography fontWeight={600}>
                        Publish immediately
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Turn off to save as draft.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* Submit */}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disableElevation
                disabled={createBlog.isPending}
                startIcon={
                  createBlog.isPending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <PublishOutlinedIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {createBlog.isPending
                  ? "Publishing..."
                  : "Create Blog Post"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default BlogEditor;