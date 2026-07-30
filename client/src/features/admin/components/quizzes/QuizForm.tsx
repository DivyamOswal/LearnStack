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
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <QuizOutlinedIcon
            color="primary"
            sx={{ fontSize: 34 }}
          />

          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Create Quiz
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Configure the quiz before adding
              questions.
            </Typography>
          </Box>

          <Chip
            label="Quiz Setup"
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {createQuiz.isError && (
                <Alert severity="error">
                  Failed to create quiz.
                </Alert>
              )}

              {/* Title */}

              <Box>
                <Typography
                  fontWeight={700}
                  mb={1}
                >
                  Quiz Information
                </Typography>

                <TextField
                  label="Quiz Title"
                  placeholder="React Fundamentals Quiz"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  helperText={`${title.length} characters`}
                />
              </Box>

              <Divider />

              {/* Configuration */}

              <Typography
                fontWeight={700}
              >
                Quiz Configuration
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                spacing={2}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Time Limit (minutes)"
                  placeholder="Optional"
                  value={timeLimitMins}
                  onChange={(e) =>
                    setTimeLimitMins(
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <TimerOutlinedIcon
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Passing Score (%)"
                  value={passingScore}
                  onChange={(e) =>
                    setPassingScore(
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <EmojiEventsOutlinedIcon
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
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
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        negativeMarking
                      }
                      onChange={(e) =>
                        setNegativeMarking(
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <GppGoodOutlinedIcon
                          fontSize="small"
                        />

                        <Typography
                          fontWeight={600}
                        >
                          Enable Negative
                          Marking
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Deduct marks for
                        incorrect answers.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Divider />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disableElevation
                disabled={
                  createQuiz.isPending
                }
                startIcon={
                  createQuiz.isPending ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
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
                {createQuiz.isPending
                  ? "Creating Quiz..."
                  : "Create Quiz"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default QuizForm;