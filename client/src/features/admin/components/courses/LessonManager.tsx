import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import {
  useCreateLesson,
  useDeleteLesson,
} from "../../courses/adminCourseApi";

import {
  AdminChapter,
  LessonType,
} from "../../courses/adminCourse.type";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

const lessonIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return <PlayCircleOutlinedIcon />;
    case "ARTICLE":
      return <ArticleOutlinedIcon />;
    case "CODE_SNIPPET":
      return <CodeOutlinedIcon />;
    default:
      return <DescriptionOutlinedIcon />;
  }
};

const chipColor = (type: LessonType) => {
  switch (type) {
    case "VIDEO":
      return "primary";
    case "ARTICLE":
      return "success";
    case "MARKDOWN":
      return "warning";
    default:
      return "secondary";
  }
};

const LessonManager = ({ chapter }: { chapter: AdminChapter }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LessonType>("ARTICLE");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const createLesson = useCreateLesson();
  const deleteLesson = useDeleteLesson();

  const needsContent =
    type === "ARTICLE" ||
    type === "MARKDOWN" ||
    type === "CODE_SNIPPET";

  const needsVideo = type === "VIDEO";

  const handleAdd = () => {
    if (!title.trim()) return;

    const nextOrder = chapter.lessons.length + 1;

    createLesson.mutate(
      {
        input: {
          title,
          type,
          order: nextOrder,
          chapterId: chapter.id,
          content: needsContent ? content : undefined,
        },
        videoFile:
          needsVideo && videoFile ? videoFile : undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setVideoFile(null);
          setShowForm(false);
        },
      }
    );
  };

  return (
    <Box sx={{ pl: 3, pt: 2 }}>
      <Stack spacing={2}>
        {chapter.lessons.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <PlayCircleOutlinedIcon
              sx={{ fontSize: 48, color: "text.secondary" }}
            />
            <Typography mt={2} fontWeight={700}>
              No lessons yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first lesson below.
            </Typography>
          </Paper>
        )}

        {chapter.lessons.map((lesson, index) => (
          <Card
            key={lesson.id}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { boxShadow: 2 },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {lessonIcon(lesson.type)}
                </Avatar>

                <Box flex={1}>
                  <Typography fontWeight={700}>
                    {lesson.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Lesson {index + 1}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  variant="outlined"
                  color={chipColor(lesson.type)}
                  label={lesson.type.replace("_", " ")}
                />

                <IconButton
                  color="error"
                  onClick={() =>
                    setDeleteTargetId(lesson.id)
                  }
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {!showForm ? (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => setShowForm(true)}
          >
            Add Lesson
          </Button>
        ) : (
          <Collapse in={showForm}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Stack spacing={2}>
                <Typography fontWeight={700}>
                  New Lesson
                </Typography>

                <Divider />

                <TextField
                  label="Lesson Title"
                  fullWidth
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

                <TextField
                  select
                  label="Lesson Type"
                  fullWidth
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as LessonType
                    )
                  }
                >
                  <MenuItem value="VIDEO">
                    <PlayCircleOutlinedIcon
                      sx={{ mr: 1 }}
                    />
                    Video
                  </MenuItem>

                  <MenuItem value="ARTICLE">
                    <ArticleOutlinedIcon
                      sx={{ mr: 1 }}
                    />
                    Article
                  </MenuItem>

                  <MenuItem value="MARKDOWN">
                    <DescriptionOutlinedIcon
                      sx={{ mr: 1 }}
                    />
                    Markdown
                  </MenuItem>

                  <MenuItem value="CODE_SNIPPET">
                    <CodeOutlinedIcon
                      sx={{ mr: 1 }}
                    />
                    Code Snippet
                  </MenuItem>
                </TextField>

                {needsContent && (
                  <TextField
                    label="Content"
                    multiline
                    rows={5}
                    fullWidth
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                    helperText={`${content.length} characters`}
                  />
                )}

                {needsVideo && (
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 3,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={1}
                    >
                      <CloudUploadOutlinedIcon />
                      <Typography fontWeight={600}>
                        {videoFile
                          ? videoFile.name
                          : "Upload Lesson Video"}
                      </Typography>
                    </Stack>

                    <input
                      hidden
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setVideoFile(
                          e.target.files?.[0] ?? null
                        )
                      }
                    />
                  </Button>
                )}

                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={
                      createLesson.isPending
                    }
                    onClick={handleAdd}
                  >
                    {createLesson.isPending
                      ? "Adding..."
                      : "Add Lesson"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Collapse>
        )}
      </Stack>

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete lesson?"
        description="This will permanently remove this lesson and any student progress tied to it."
        confirmLabel="Delete"
        onConfirm={() =>
          deleteTargetId &&
          deleteLesson.mutate(deleteTargetId, {
            onSuccess: () =>
              setDeleteTargetId(null),
          })
        }
        onCancel={() =>
          setDeleteTargetId(null)
        }
        isLoading={deleteLesson.isPending}
      />
    </Box>
  );
};

export default LessonManager;