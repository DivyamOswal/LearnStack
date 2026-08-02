import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";

import {
  useChaptersForCourse,
  useCreateChapter,
} from "../../courses/adminCourseApi";

import LessonManager from "./LessonManager";

const glassPanel = {
  bgcolor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
};

const ChapterManager = ({ courseId }: { courseId: string }) => {
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [expandedId, setExpandedId] = useState<string | false>(false);

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
        onSuccess: (chapter) => {
          setNewChapterTitle("");
          setExpandedId(chapter.id); // open the newly created chapter
        },
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        ...glassPanel,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 2,
              flexShrink: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))",
              border: "1px solid rgba(99,102,241,0.4)",
            }}
          >
            <MenuBookOutlinedIcon sx={{ color: "primary.main" }} />
          </Box>

          <Box flex={1}>
            <Typography variant="h6" fontWeight={700}>
              Course Chapters
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Organize chapters and lessons for this course.
            </Typography>
          </Box>

          <Chip
            label={`${chapters?.length ?? 0} Chapters`}
            className="font-mono-ui"
            sx={{
              bgcolor: "rgba(99,102,241,0.12)",
              color: "primary.main",
              border: "1px solid rgba(99,102,241,0.3)",
              fontWeight: 600,
            }}
          />
        </Stack>
      </Box>

      <Box p={3} sx={{ position: "relative" }}>
        {/* Loading */}
        {isLoading && (
          <Stack alignItems="center" spacing={2} py={5}>
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
              bgcolor: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <AutoStoriesOutlinedIcon
              sx={{ fontSize: 50, color: "text.secondary", mb: 1 }}
            />
            <Typography fontWeight={600}>No chapters yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first chapter below.
            </Typography>
          </Paper>
        )}

        {/* Chapter List — collapsible */}
        <Stack spacing={2}>
          {chapters?.map((chapter, index) => (
            <Accordion
              key={chapter.id}
              disableGutters
              elevation={0}
              expanded={expandedId === chapter.id}
              onChange={(_, isExpanded) => setExpandedId(isExpanded ? chapter.id : false)}
              sx={{
                borderRadius: "12px !important",
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:before": { display: "none" },
                "&:hover": { borderColor: "rgba(99,102,241,0.3)" },
                "&.Mui-expanded": {
                  borderColor: "rgba(99,102,241,0.5)",
                  boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 8px 24px rgba(99,102,241,0.15)",
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "text.secondary" }} />}
                sx={{
                  px: 2.5,
                  py: 1,
                  "& .MuiAccordionSummary-content": {
                    minWidth: 0,
                    overflow: "hidden",
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%", minWidth: 0, pr: 1 }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))",
                      border: "1px solid rgba(99,102,241,0.4)",
                      color: "primary.main",
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight={700}
                      fontSize={16}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {chapter.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chapter {index + 1}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${chapter.lessons.length} Lessons`}
                    size="small"
                    className="font-mono-ui"
                    sx={{
                      flexShrink: 0,
                      bgcolor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "text.secondary",
                    }}
                  />
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }} />
                <LessonManager chapter={chapter} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        {/* Add Chapter */}
        <Paper
          variant="outlined"
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Typography fontWeight={600} mb={2}>
            Add New Chapter
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              placeholder="Enter chapter title..."
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
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
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              }}
            >
              {createChapter.isPending ? "Adding..." : "Add Chapter"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
};

export default ChapterManager;