
// Common color palette
const palette = {
    primary: '#137fec',
    white: '#ffffff',
    black: '#000000',
    gray100: '#f6f7f8', // Light background
    gray200: '#dbe0e6', // Light border
    gray300: '#e5e7eb',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#617589', // Light text secondary
    gray700: '#374151', // Dark border
    gray800: '#1f2937', // Dark input bg
    gray900: '#101922', // Dark background / card
};

export const AppTheme = {
    colors: {
        light: {
            primary: palette.primary,
            background: palette.gray100,
            card: palette.white,
            text: '#111418',
            textSecondary: palette.gray600,
            border: palette.gray200,
            inputBg: palette.white,
            iconBg: 'rgba(19, 127, 236, 0.1)',
            primaryText: palette.white,
            error: '#ef4444',
        },
        dark: {
            primary: palette.primary,
            background: palette.gray900,
            card: palette.gray900,
            text: palette.white,
            textSecondary: palette.gray400,
            border: palette.gray700,
            inputBg: palette.gray800,
            iconBg: 'rgba(19, 127, 236, 0.1)',
            primaryText: palette.white,
            error: '#ef4444',
        },
    },
    // Helper to get colors based on scheme
    getColors: (scheme: 'light' | 'dark' | null | undefined) => {
        return scheme === 'dark' ? AppTheme.colors.dark : AppTheme.colors.light;
    }
};
