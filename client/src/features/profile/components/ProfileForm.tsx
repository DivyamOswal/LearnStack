import { useState, useEffect } from 'react';
import { TextField, Button, Alert, Typography } from '@mui/material';
import { useUpdateProfile } from '../profileApi';
import { UserProfile } from '../profile.types';
import AvatarUploader from './AvatarUploader';
import SocialLinksEditor from './SocialLinksEditor';

const ProfileForm = ({ profile }: { profile: UserProfile }) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(profile.socialLinks ?? {});
  const [avatarFile, setAvatarFile] = useState<File | undefined>();

  const updateProfile = useUpdateProfile();

  useEffect(() => {
    setName(profile.name);
    setBio(profile.bio ?? '');
    setSocialLinks(profile.socialLinks ?? {});
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ input: { name, bio, socialLinks }, avatarFile });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      {updateProfile.isSuccess && <Alert severity="success">Profile updated.</Alert>}
      {updateProfile.isError && <Alert severity="error">Failed to update profile. Please try again.</Alert>}

      <AvatarUploader currentAvatarUrl={profile.avatarUrl} name={profile.name} onFileSelect={setAvatarFile} />

      <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={3}
        fullWidth
        helperText={`${bio.length}/500`}
        inputProps={{ maxLength: 500 }}
      />

      <div>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Social links</Typography>
        <SocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
      </div>

      <Button type="submit" variant="contained" disableElevation size="large" disabled={updateProfile.isPending} sx={{ alignSelf: 'flex-start' }}>
        {updateProfile.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;