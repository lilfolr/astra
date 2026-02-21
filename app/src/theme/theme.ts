import Colors from './colors';

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    warning: string;
    success: string;
    border: string;
    card: string;
    glass: string;
    inputBg: string;
    placeholder: string;
    accent: string;
  };
}

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    background: Colors.deepObsidian,
    text: Colors.white,
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    primary: Colors.cyan,
    secondary: Colors.white,
    warning: Colors.neonOrange,
    success: Colors.acidGreen,
    border: 'rgba(0, 255, 255, 0.3)',
    card: Colors.glass,
    glass: Colors.glass,
    inputBg: 'rgba(16, 30, 35, 0.6)',
    placeholder: 'rgba(255, 255, 255, 0.3)',
    accent: Colors.cyan,
  },
};

export const LightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F2F2F7',
    text: '#1C1C1E',
    textSecondary: 'rgba(28, 28, 30, 0.6)',
    primary: '#007171', // Deep Cyan for better contrast on light bg
    secondary: '#1C1C1E',
    warning: '#C2410C',
    success: '#15803D',
    border: 'rgba(0, 113, 113, 0.2)',
    card: 'rgba(255, 255, 255, 0.8)',
    glass: 'rgba(0, 0, 0, 0.05)',
    inputBg: '#FFFFFF',
    placeholder: 'rgba(0, 0, 0, 0.4)',
    accent: '#007171',
  },
};
