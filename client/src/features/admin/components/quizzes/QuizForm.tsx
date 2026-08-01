import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";

import { useCreateQuiz } from "../../quizzes/adminQuizApi";

const glassPanel = {
  bgcolor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
};

interface QuizFormProps {
  courseId: string;
  onSuccess: (quizId: string) => void;
}

const QuizForm = ({ courseId, onSuccess }: QuizFormProps) => {
  const [title, setTitle] = useState("");
  const [timeLimitMins, setTimeLimitMins] = useState("");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [passingScore, setPassingScore] = useState("50");

  const createQuiz = useCreateQuiz();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createQuiz.mutate(
      {
        title,
        courseId,
        timeLimitMins: timeLimitMins
          ? parseInt(timeLimitMins, 10)
          : undefined,
        negativeMarking,
        passingScore: parseInt(passingScore, 10),
      },
      {
        onSuccess: (quiz) => onSuccess(quiz.id),
      }
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 750,
        mx: "auto",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        ...glassPanel,
      }}
    >
      {/* Ambient glow accent */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          p: 3,
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
              width: 48,
              height: 48,
              borderRadius: 2,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.08))",
              border: "1px solid rgba(99,102,241,0.4)",
            }}
          >
            <QuizOutlinedIcon sx={{ fontSize: 26, color: "primary.main" }} />
          </Box>

          <Box flex={1}>
            <Typography variant="h5" fontWeight={700}>
              Create Quiz
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Configure the quiz before adding questions.
            </Typography>
          </Box>

          <Chip
            label="Quiz Setup"
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

      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
        <CardContent sx={{ position: "relative" }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {createQuiz.isError && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  Failed to create quiz.
                </Alert>
              )}

              {/* Title */}
              <Box>
                <Typography fontWeight={700} mb={1}>
                  Quiz Information
                </Typography>

                <TextField
                  label="Quiz Title"
                  placeholder="React Fundamentals Quiz"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  helperText={`${title.length} characters`}
                />
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

              {/* Configuration */}
              <Typography fontWeight={700}>Quiz Configuration</Typography>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Time Limit (minutes)"
                  placeholder="Optional"
                  value={timeLimitMins}
                  onChange={(e) => setTimeLimitMins(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <TimerOutlinedIcon
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Passing Score (%)"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <EmojiEventsOutlinedIcon
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    ),
                  }}
                />
              </Stack>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: negativeMarking
                    ? "rgba(99,102,241,0.06)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: negativeMarking
                    ? "rgba(99,102,241,0.3)"
                    : "rgba(255,255,255,0.08)",
                  transition: "all 0.2s ease",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={negativeMarking}
                      onChange={(e) =>
                        setNegativeMarking(e.target.checked)
                      }
                    />
                  }
                  label={
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <GppGoodOutlinedIcon
                          fontSize="small"
                          sx={{
                            color: negativeMarking
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        />

                        <Typography fontWeight={600}>
                          Enable Negative Marking
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        Deduct marks for incorrect answers.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disableElevation
                disabled={createQuiz.isPending}
                startIcon={
                  createQuiz.isPending ? (
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
                  boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                }}
              >
                {createQuiz.isPending ? "Creating Quiz..." : "Create Quiz"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default QuizForm;