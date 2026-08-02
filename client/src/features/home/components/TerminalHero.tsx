import { useState, useEffect } from "react";
import { Typography, Paper, Box, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const commands = [
  { prompt: "$ learnstack enroll --course=react-fundamentals", output: "✓ enrolled • access granted" },
  { prompt: "$ learnstack quiz --submit", output: "✓ 92% passed" },
  { prompt: "$ learnstack certificate --generate", output: "✓ CERT-4F9A2B1C issued" },
];

const useTypewriter = (text: string, speed = 28) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
};

export default function TerminalHero() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [index, setIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const typedPrompt = useTypewriter(commands[index].prompt);

  useEffect(() => {
    setShowOutput(false);

    if (typedPrompt === commands[index].prompt) {
      const outputTimer = setTimeout(() => setShowOutput(true), 200);
      const nextTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % commands.length);
      }, 2200);

      return () => {
        clearTimeout(outputTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [typedPrompt, index]);

  return (
    <Box sx={{ position: "relative", maxWidth: 480, width: "100%" }}>
      {isDark && (
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
            zIndex: 0,
          }}
        />
      )}

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: isDark ? "rgba(99,102,241,0.2)" : "divider",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "background.paper",
          backdropFilter: "blur(14px)",
          boxShadow: isDark
            ? "0 20px 60px rgba(0,0,0,.45), 0 0 40px rgba(99,102,241,.08)"
            : "0 20px 60px rgba(15,23,42,.10)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "divider",
            bgcolor: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
          }}
        >
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ff5f56" }} />
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#27c93f" }} />
          <Typography sx={{ ml: 1, fontSize: 12, color: "text.secondary", fontFamily: "monospace" }}>
            learnstack@terminal
          </Typography>
        </Box>

        <Box sx={{ p: 3, minHeight: 170 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontFamily: "monospace",
                color: "text.primary",
                fontSize: "0.95rem",
                wordBreak: "break-word",
              }}
            >
              {typedPrompt}
            </Typography>

            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
              style={{
                width: 8,
                height: 18,
                marginLeft: 3,
                borderRadius: 2,
                background: theme.palette.primary.main,
                display: "inline-block",
              }}
            />
          </Box>

          <AnimatePresence mode="wait">
            {showOutput && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Typography
                  sx={{
                    mt: 2,
                    color: "success.main",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {commands[index].output}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px dashed",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "divider",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontFamily: "monospace",
              }}
            >
              Interactive CLI Preview • Automatically adapts to Light & Dark Mode
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}