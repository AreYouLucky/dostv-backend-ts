export type Appearance = 'dark';

export function initializeTheme() {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
}

export function useAppearance() {
    return {
        appearance: 'dark',
        updateAppearance: () => {}, 
    } as const;
}