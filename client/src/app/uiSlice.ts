import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  themeMode: 'light' | 'dark';
}

const getInitialMode = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('themeMode');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: UIState = {
  themeMode: getInitialMode(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
  },
});

export const { toggleThemeMode, setThemeMode } = uiSlice.actions;
export default uiSlice.reducer;