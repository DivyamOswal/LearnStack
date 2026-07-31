import { useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useCreateBlog } from "../../../blog/blogApi";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const createBlog = useCreateBlog();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBlog.mutate(
      { input: { title, content, isPublished }, coverImage: coverImage ?? undefined },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setIsPublished(false);
          handleRemoveCover();
        },
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{ maxWidth: 900, mx: "auto", borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "hidden" }}
    >
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "10px",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <ArticleOutlinedIcon color="primary" sx={{ fontSize: 22 }} />
          </Box>

          <Box>
            <Typography variant="overline" color="primary.main" className="font-mono-ui" sx={{ lineHeight: 1 }}>
              $ blog --new
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              Write a new post
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <AnimatePresence>
            {createBlog.isError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  Failed to create post.
                </Alert>
              </motion.div>
            )}
            {createBlog.isSuccess && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Post created successfully.
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Blog Title"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Blog Content"
                placeholder="Start writing here..."
                multiline
                rows={12}
                fullWidth
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                helperText={
                  <Typography component="span" className="font-mono-ui" variant="caption">
                    {content.length} characters
                  </Typography>
                }
              />

              {/* Cover upload */}
              <Box>
                <Typography fontWeight={600} mb={1} display="flex" alignItems="center" gap={1} fontSize="0.95rem">
                  <ImageOutlinedIcon fontSize="small" />
                  Cover Image
                </Typography>

                <AnimatePresence mode="wait">
                  {coverPreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: "divider",
                          aspectRatio: "21 / 9",
                        }}
                      >
                        <Box
                          component="img"
                          src={coverPreview}
                          alt="Cover preview"
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <Button
                          size="small"
                          onClick={handleRemoveCover}
                          startIcon={<CloseIcon fontSize="small" />}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(13,17,23,0.75)",
                            color: "#fff",
                            "&:hover": { bgcolor: "rgba(13,17,23,0.9)" },
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Button
                        component="label"
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderStyle: "dashed",
                          borderWidth: 2,
                          py: 4,
                          borderRadius: 2,
                          transition: "border-color 0.2s ease, background-color 0.2s ease",
                          "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <CloudUploadOutlinedIcon fontSize="large" sx={{ color: "text.secondary" }} />
                          <Typography fontWeight={600}>Click to upload cover image</Typography>
                          <Typography variant="caption" color="text.secondary" className="font-mono-ui">
                            PNG, JPG, WEBP
                          </Typography>
                        </Stack>
                        <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleFileChange} />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Divider />

              {/* Publish toggle */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  transition: "border-color 0.2s ease",
                  borderColor: isPublished ? "primary.main" : "divider",
                }}
              >
                <FormControlLabel
                  control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />}
                  label={
                    <Box>
                      <Typography fontWeight={600}>Publish immediately</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Turn off to save as draft.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <motion.div whileTap={{ scale: createBlog.isPending ? 1 : 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disableElevation
                  disabled={createBlog.isPending}
                  startIcon={
                    createBlog.isPending ? <CircularProgress size={18} color="inherit" /> : <PublishOutlinedIcon />
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 16,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 8px 20px -8px var(--mui-palette-primary-main, #2DD4BF)",
                    },
                  }}
                >
                  {createBlog.isPending ? "Publishing..." : "Create Blog Post"}
                </Button>
              </motion.div>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default BlogEditor;