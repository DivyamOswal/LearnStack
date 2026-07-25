import { useState } from 'react';
import { Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import { useProfile } from '@/features/profile/profileApi';
import ProfileForm from '@/features/profile/components/ProfileForm';
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm';

const ProfileSettingsPage = () => {
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <Typography variant="overline" color="primary.main">
        $ settings
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 4, fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Account settings
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        className="font-mono-ui"
        sx={{ mb: 4, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab value="profile" label="profile" />
        <Tab value="security" label="security" />
      </Tabs>

      {tab === 'profile' && <ProfileForm profile={profile} />}
      {tab === 'security' && <ChangePasswordForm />}
    </div>
  );
};

export default ProfileSettingsPage;