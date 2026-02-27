import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

/**
 * 🔥 IMPORTANT:
 * We store all page imports so we can preload them.
 */
const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            pages
        );

        /**
         * ⭐ Preload frequently-used admin pages
         */
        const preloadPages = [
            './pages/cms/advertisement/advertisement-page.tsx',
            './pages/banner/banners-page.tsx',
            './pages/category/categories-page.tsx',
            './pages/post/posts-page.tsx',
            './pages/post/partials/post-form.tsx',
            './pages/program/programs-page.tsx',
            './pages/testimonial/testimonials-page.tsx',
        ];

        preloadPages.forEach((p) => pages[p]?.());

        return page;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                </QueryClientProvider>
            </StrictMode>
        );
    },

    progress: {
        delay: 250,
        color: '#29d',
        includeCSS: true,
        showSpinner: false,
    },

    /**
     * ⚠️ ViewTransition API adds slight overhead on first visit.
     * Keep if you like animations, but you can test performance by disabling.
     */
    defaults: {
        visitOptions: () => {
            return { viewTransition: true };
        },
    },
});