import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAppSelector } from './hooks';
import { buildTheme } from '../theme/theme';
import { useAuthInitializer } from '../features/auth/hooks/useAuth';
import { AppRouter } from './router';

const App = () => {
  useAuthInitializer();

  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = buildTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;