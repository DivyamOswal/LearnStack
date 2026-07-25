import { TextField } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import LanguageIcon from '@mui/icons-material/Language';

interface SocialLinksEditorProps {
  links: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
}

const platforms = [
  { key: 'github', label: 'GitHub', icon: GitHubIcon },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
  { key: 'twitter', label: 'X / Twitter', icon: XIcon },
  { key: 'website', label: 'Personal website', icon: LanguageIcon },
];

const SocialLinksEditor = ({ links, onChange }: SocialLinksEditorProps) => {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...links, [key]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      {platforms.map(({ key, label, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2">
          <Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <TextField
            placeholder={`${label} URL`}
            value={links[key] ?? ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            size="small"
            fullWidth
          />
        </div>
      ))}
    </div>
  );
};

export default SocialLinksEditor;