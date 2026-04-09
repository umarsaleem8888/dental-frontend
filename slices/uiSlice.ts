
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types';

const initialState: UIState = {
  theme: 'light',
  glassMode: false,
  sidebarGradient: {
    start: '#0f172a',
    end: '#1e293b',
    name: 'midnight pro'
  },
  sidebarBgColor: '#0f172a',
  bodyColor: '#f8fafc',
  primaryColor: '#0ea5e9',
  cardColor: '#ffffff',
  cardPadding: 'comfortable',
  textColor: '#0f172a',
  fontSize: 'medium',
  fontFamily: "'Inter', sans-serif",
  topBarGradient: {
    start: 'rgba(255, 255, 255, 0.7)',
    end: 'rgba(255, 255, 255, 0.4)',
  },
  topBarColor: 'rgba(255, 255, 255, 0.7)',
  topBarOpacity: 0.9,
  topBarFloating: false,
  topBarButtonStyle: 'rounded',
  buttonStyle: 'gradient',
  buttonRadius: 'xl',
  sidebarLayout: {
    width: 280,
    collapsed: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {

    setInitialState: (state, payload) => {

      const data = payload.payload;

      state.theme = data?.theme;
      state.glassMode = data?.glassMode;

      state.sidebarGradient = {
        start: data?.sidebarGradient?.start,
        end: data?.sidebarGradient?.end,
        name: data?.sidebarGradient?.name,
      };

      state.sidebarBgColor = data?.sidebarBgColor;
      state.bodyColor = data?.bodyColor;
      state.primaryColor = data?.primaryColor;
      state.cardColor = data?.cardColor;
      state.cardPadding = data?.cardPadding;
      state.textColor = data?.textColor;
      state.fontSize = data?.fontSize;
      state.fontFamily = data?.fontFamily;

      state.topBarGradient = {
        start: data?.topBarGradient?.start,
        end: data?.topBarGradient?.end,
      };

      state.topBarColor = data?.topBarColor;
      state.topBarOpacity = data?.topBarOpacity;
      state.topBarFloating = data?.topBarFloating;
      state.topBarButtonStyle = data?.topBarButtonStyle;
      state.buttonStyle = data?.buttonStyle;
      state.buttonRadius = data?.buttonRadius;

      state.sidebarLayout = {
        width: data?.width,
        collapsed: data?.collapsed,
      };
    },


    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
        state.topBarGradient = {
          start: 'rgba(15, 23, 42, 0.8)',
          end: 'rgba(15, 23, 42, 0.5)',
        };
        state.topBarColor = 'rgba(15, 23, 42, 0.8)';
      } else {
        document.documentElement.classList.remove('dark');
        state.topBarGradient = {
          start: 'rgba(255, 255, 255, 0.7)',
          end: 'rgba(255, 255, 255, 0.4)',
        };
        state.topBarColor = 'rgba(255, 255, 255, 0.7)';
      }
    },
    toggleGlassMode: (state) => {
      state.glassMode = !state.glassMode;
    },
    resetUI: () => initialState,
    applyThemePreset: (state, action: PayloadAction<Partial<UIState>>) => {
      return { ...state, ...action.payload };
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarLayout.width = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarLayout.collapsed = !state.sidebarLayout.collapsed;
    },
    setSidebarGradient: (state, action: PayloadAction<{ start: string; end: string; name: string }>) => {
      state.sidebarGradient = action.payload;
      state.sidebarBgColor = action.payload.start;
    },
    setSidebarBgColor: (state, action: PayloadAction<string>) => {
      state.sidebarBgColor = action.payload;
      state.sidebarGradient = { start: action.payload, end: action.payload, name: action.payload };
    },
    setBodyColor: (state, action: PayloadAction<string>) => {
      state.bodyColor = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setCardColor: (state, action: PayloadAction<string>) => {
      state.cardColor = action.payload;
    },
    setCardPadding: (state, action: PayloadAction<'compact' | 'comfortable' | 'spacious'>) => {
      state.cardPadding = action.payload;
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload;
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
    },
    setTopBarGradient: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.topBarGradient = action.payload;
      state.topBarColor = action.payload.start;
    },
    setTopBarColor: (state, action: PayloadAction<string>) => {
      state.topBarColor = action.payload;
      state.topBarGradient = { start: action.payload, end: action.payload };
    },
    setTopBarOpacity: (state, action: PayloadAction<number>) => {
      state.topBarOpacity = action.payload;
    },
    toggleTopBarFloating: (state) => {
      state.topBarFloating = !state.topBarFloating;
    },
    setTopBarButtonStyle: (state, action: PayloadAction<'circle' | 'rounded' | 'square'>) => {
      state.topBarButtonStyle = action.payload;
    },
    setButtonStyle: (state, action: PayloadAction<'flat' | 'gradient' | 'glow'>) => {
      state.buttonStyle = action.payload;
    },
    setButtonRadius: (state, action: PayloadAction<'none' | 'md' | 'xl' | 'full'>) => {
      state.buttonRadius = action.payload;
    },
  },

});

export const {
  toggleTheme,
  toggleGlassMode,
  resetUI,
  applyThemePreset,
  setSidebarWidth,
  toggleSidebarCollapsed,
  setSidebarGradient,
  setSidebarBgColor,
  setBodyColor,
  setPrimaryColor,
  setCardColor,
  setCardPadding,
  setTextColor,
  setFontSize,
  setFontFamily,
  setTopBarGradient,
  setTopBarColor,
  setTopBarOpacity,
  toggleTopBarFloating,
  setTopBarButtonStyle,
  setButtonStyle,
  setButtonRadius,
  setInitialState
} = uiSlice.actions;
export default uiSlice.reducer;
