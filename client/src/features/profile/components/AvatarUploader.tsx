import { useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  name: string;
  onFileSelect: (file: File) => void;
}

const AvatarUploader = ({ currentAvatarUrl, name, onFileSelect }: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="relative inline-block">
      <Avatar
        src={previewUrl ?? currentAvatarUrl ?? undefined}
        sx={{ width: 88, height: 88, fontSize: '2rem', bgcolor: 'primary.main' }}
      >
        {name.charAt(0).toUpperCase()}
      </Avatar>
      <IconButton
        onClick={() => inputRef.current?.click()}
        size="small"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <PhotoCameraOutlinedIcon fontSize="small" />
      </IconButton>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
    </div>
  );
};

export default AvatarUploader;