import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import PlaygroundTabs from "@/features/playground/components/PlaygroundTabs";
import CodeEditor from "@/features/playground/components/CodeEditor";
import OutputFrame from "@/features/playground/components/OutputFrame";
import {
  PlaygroundTab,
  PlaygroundCode,
} from "@/features/playground/playground.types";

const defaultCode: PlaygroundCode = {
  html: `<h1>Hello, LearnStack</h1>
<p>Edit any tab to see it update live.</p>`,

  css: `body {
  font-family: sans-serif;
  padding: 2rem;
}

h1 {
  color: #2DD4BF;
}`,

  js: `console.log("Playground is running.");`,
};

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] =
    useState<PlaygroundTab>("html");

  const [code, setCode] =
    useState<PlaygroundCode>(defaultCode);

  const handleReset = () => setCode(defaultCode);

  return (
    <Box
      sx={{
        height: "calc(100vh - 65px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* ================= HEADER ================= */}

      <Paper
        elevation={0}
        square
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          sx={{ width: "100%" }}
        >
          {/* Left */}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
            >
              LearnStack Playground
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Practice HTML, CSS & JavaScript with
              live preview.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1.5}
            >
              <Chip
                size="small"
                color="success"
                label="Live"
              />

              <Chip
                size="small"
                label="HTML • CSS • JS"
              />

              <Chip
                size="small"
                variant="outlined"
                label="Beginner"
              />
            </Stack>
          </Box>

          {/* Right */}

          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              startIcon={<PlayArrowRoundedIcon />}
              sx={{
                minWidth: 120,
                height: 44,
              }}
            >
              Run
            </Button>

            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{
                minWidth: 120,
                height: 44,
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ================= WORKSPACE ================= */}

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2}
          sx={{
            height: "100%",
          }}
        >
          {/* ================= EDITOR ================= */}

          <Paper
            elevation={2}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <Typography
              sx={{
                p: 2,
                fontWeight: 700,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              Code Editor
            </Typography>

            <PlaygroundTabs
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
              }}
            >
              <CodeEditor
                activeTab={activeTab}
                value={code[activeTab]}
                onChange={(value) =>
                  setCode((prev) => ({
                    ...prev,
                    [activeTab]: value,
                  }))
                }
              />
            </Box>
          </Paper>

          {/* ================= PREVIEW ================= */}

          <Paper
            elevation={2}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <Typography
              sx={{
                p: 2,
                fontWeight: 700,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              Live Preview
            </Typography>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
              }}
            >
              <OutputFrame code={code} />
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* ================= FOOTER ================= */}

      <Paper
        square
        elevation={0}
        sx={{
          borderTop: 1,
          borderColor: "divider",
          px: 2,
          py: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography variant="caption">
            HTML • UTF-8 • Auto Save
          </Typography>

          <Typography
            variant="caption"
            color="success.main"
          >
            ● Live Preview
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}