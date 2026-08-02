import { useEffect, useRef, useState } from "react";

import {
  Box,
  Stack,
  Typography,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import TabletMacRoundedIcon from "@mui/icons-material/TabletMacRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";

import { PlaygroundCode } from "../playground.types";

const buildSrcDoc = (code: PlaygroundCode) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html,body{
margin:0;
padding:0;
font-family:Inter,sans-serif;
}
${code.css}
</style>
</head>

<body>

${code.html}

<script>
${code.js}
<\/script>

</body>
</html>
`;

type Device = "desktop" | "tablet" | "mobile";

const deviceWidth = {
  desktop: "100%",
  tablet: 820,
  mobile: 390,
};

const OutputFrame = ({
  code,
}: {
  code: PlaygroundCode;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);

  const [device, setDevice] =
    useState<Device>("desktop");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildSrcDoc(code);
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [code, reloadKey]);
    return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Toolbar */}

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
          >
            Live Preview
          </Typography>

          <ToggleButtonGroup
            size="small"
            exclusive
            value={device}
            onChange={(_, value) => {
              if (value) setDevice(value);
            }}
          >
            <ToggleButton value="desktop">
              <DesktopWindowsRoundedIcon fontSize="small" />
            </ToggleButton>

            <ToggleButton value="tablet">
              <TabletMacRoundedIcon fontSize="small" />
            </ToggleButton>

            <ToggleButton value="mobile">
              <SmartphoneRoundedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row">
          <Tooltip title="Refresh">
            <IconButton
              onClick={() =>
                setReloadKey((v) => v + 1)
              }
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open in New Tab">
            <IconButton>
              <OpenInNewRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fullscreen">
            <IconButton>
              <FullscreenRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
            {/* Preview Area */}

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "#0F172A"
              : "#F5F7FB",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          p: 4,
          position: "relative",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(0,0,0,.08)",
              zIndex: 5,
            }}
          >
            <CircularProgress />

            <Typography
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Building Preview...
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            width: deviceWidth[device],
            maxWidth:
              device === "desktop"
                ? "100%"
                : deviceWidth[device],

            height: "100%",

            bgcolor: "#fff",

            borderRadius: 4,

            overflow: "hidden",

            border: "1px solid",

            borderColor: "divider",

            boxShadow:
              "0 30px 70px rgba(0,0,0,.15)",

            transition: ".35s",
          }}
        >
          {/* Fake Browser Bar */}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#ECEFF3",
              borderBottom: "1px solid #D7DCE2",
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#FF5F57",
              }}
            />

            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#FFBD2E",
              }}
            />

            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#28C840",
              }}
            />

            <Box
              sx={{
                ml: 2,
                px: 2,
                py: .4,
                bgcolor: "#fff",
                borderRadius: 20,
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                https://preview.learnstack.dev
              </Typography>
            </Box>
          </Stack>

          <iframe
            key={reloadKey}
            ref={iframeRef}
            title="Preview"

            sandbox="allow-scripts"

            style={{
              width: "100%",
              height: "calc(100% - 48px)",
              border: "none",
              background: "#fff",
            }}
          />
        </Box>
      </Box>

      {/* Status Bar */}

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: .75,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Live Rendering
        </Typography>

        <Stack direction="row" spacing={3}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            HTML
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            CSS
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            JavaScript
          </Typography>

          <Typography
            variant="caption"
            color="success.main"
            sx={{ fontWeight: 700 }}
          >
            ● Running
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OutputFrame;