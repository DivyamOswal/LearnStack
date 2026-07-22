import { PaletteMode } from '@mui/material';

export const getPalette = (mode: PaletteMode) => ({
  mode,
  primary: {
    main: '#2DD4BF', // signature teal accent LearnStack single color, no gradient
    contrastText: '#0D1117',
  },
  ...(mode === 'light'
    ? {
        background: {
          default: '#F6F8FA',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#0D1117',
          secondary: '#57606A',
        },
        divider: '#D0D7DE',
      }
    : {
        background: {
          default: '#0D1117',
          paper: '#161B22',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#7D8590',
        },
        divider: '#30363D',
      }),
});