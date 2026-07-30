import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  name?: string | null;
  onFileSelect: (file: File) => void;
}

const AvatarUploader = ({
  currentAvatarUrl,
  name,
  onFileSelect,
}: AvatarUploaderProps) => {
  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));

    onFileSelect(file);
  };

  const avatarLetter =
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <Avatar
        src={previewUrl ?? currentAvatarUrl ?? undefined}
        sx={{
          width: 96,
          height: 96,
          fontSize: "2rem",
          fontWeight: 700,
          bgcolor: "primary.main",
          border: "3px solid",
          borderColor: "background.paper",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 30px rgba(0,0,0,.45)"
              : "0 10px 30px rgba(15,23,42,.15)",
          transition: "all .25s ease",
        }}
      >
        {avatarLetter}
      </Avatar>

      <Tooltip title="Change profile photo">
        <IconButton
          onClick={() => inputRef.current?.click()}
          size="small"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,

            width: 34,
            height: 34,

            bgcolor: "background.paper",

            border: "1px solid",
            borderColor: "divider",

            boxShadow: 2,

            "&:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              transform: "scale(1.08)",
            },

            transition: "all .2s ease",
          }}
        >
          <PhotoCameraOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default AvatarUploader;