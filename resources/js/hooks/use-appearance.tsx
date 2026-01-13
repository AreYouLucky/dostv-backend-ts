export type Appearance = 'light';

export function initializeTheme() {
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
}

export function useAppearance() {
    return {
        appearance: 'light',
        updateAppearance: () => {}, 
    } as const;
}