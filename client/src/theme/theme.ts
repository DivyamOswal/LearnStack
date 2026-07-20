import { createTheme, PaletteMode } from '@mui/material';
import { getPalette } from './palette';

export const buildTheme = (mode: PaletteMode) =>
  createTheme({
    palette: getPalette(mode),
    shape: {
      borderRadius: 8, // slightly tighter than default MUI 12px — reads more "editor panel" than "app icon"
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      overline: {
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: '0.05em',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          label: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' },
        },
      },
    },
  });