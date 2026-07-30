import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";

import {
  useChaptersForCourse,
  useCreateChapter,
} from "../../courses/adminCourseApi";

import LessonManager from "./LessonManager";

const ChapterManager = ({ courseId }: { courseId: string }) => {
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const { data: chapters, isLoading } =
    useChaptersForCourse(courseId);

  const createChapter = useCreateChapter();

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;

    const nextOrder = (chapters?.length ?? 0) + 1;

    createChapter.mutate(
      {
        title: newChapterTitle,
        order: nextOrder,
        courseId,
      },
      {
        onSuccess: () => setNewChapterTitle(""),
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <MenuBookOutlinedIcon color="primary" />

          <Box flex={1}>
            <Typography variant="h6" fontWeight={700}>
              Course Chapters
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Organize chapters and lessons for this course.
            </Typography>
          </Box>

          <Chip
            label={`${chapters?.length ?? 0} Chapters`}
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Box p={3}>
        {/* Loading */}

        {isLoading && (
          <Stack
            alignItems="center"
            spacing={2}
            py={5}
          >
            <CircularProgress size={30} />
            <Typography color="text.secondary">
              Loading chapters...
            </Typography>
          </Stack>
        )}

        {/* Empty */}

        {!isLoading && (!chapters || chapters.length === 0) && (
          <Paper
            variant="outlined"
            sx={{
              py: 5,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <AutoStoriesOutlinedIcon
              sx={{
                fontSize: 50,
                color: "text.secondary",
                mb: 1,
              }}
            />

            <Typography fontWeight={600}>
              No chapters yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Create your first chapter below.
            </Typography>
          </Paper>
        )}

        {/* Chapter List */}

        <Stack spacing={2}>
          {chapters?.map((chapter, index) => (
            <Card
              key={chapter.id}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "0.25s",
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  {/* Number */}

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Title */}

                  <Box flex={1}>
                    <Typography
                      fontWeight={700}
                      fontSize={16}
                    >
                      {chapter.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Chapter {index + 1}
                    </Typography>
                  </Box>

                  {/* Lesson Count */}

                  <Chip
                    label={`${chapter.lessons.length} Lessons`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <LessonManager chapter={chapter} />
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Add Chapter */}

        <Paper
          variant="outlined"
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
          }}
        >
          <Typography
            fontWeight={600}
            mb={2}
          >
            Add New Chapter
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              placeholder="Enter chapter title..."
              value={newChapterTitle}
              onChange={(e) =>
                setNewChapterTitle(e.target.value)
              }
              fullWidth
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              disabled={createChapter.isPending}
              onClick={handleAddChapter}
              sx={{
                minWidth: 180,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {createChapter.isPending
                ? "Adding..."
                : "Add Chapter"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
};

export default ChapterManager;