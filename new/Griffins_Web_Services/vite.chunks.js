// vite.chunks.js

export function manualChunks(id) {
  // Core React runtime - split into minimal core and client runtime
  // This allows critical hydration code to load first
  if (id.includes('node_modules/scheduler')) {
    return 'react-core';
  }
  if (
    id.includes('node_modules/react-dom/client') ||
    id.includes('node_modules/react-dom/cjs/react-dom-client')
  ) {
    return 'react-core';
  }
  if (
    id.includes('node_modules/react/') ||
    id.includes('node_modules/react-dom/')
  ) {
    return 'react-core';
  }

  // Core utilities needed by BaseLayout's scroll animations script
  // Must be separate so they don't pull in heavy carousel/feature-card chunks
  if (
    id.includes('utils/IntersectionObserver') ||
    id.includes('scripts/scrollAnimations')
  ) {
    return 'scroll-observer';
  }

  // Visibility and interaction hooks - used by LottieLogo in header
  // Must be separate from carousels/engagement-hooks to avoid loading those on initial navigation
  // Note: this must come BEFORE engagement-hooks rule to take priority
  if (
    id.includes('hooks/animations/useVisibility') ||
    id.includes('hooks/interactions/useScrollInteraction') ||
    id.includes('hooks/interactions/utils')
  ) {
    return 'visibility-hooks';
  }

  // Shared utilities used by multiple chunks - prevents Vite from bundling
  // these into a random chunk (like accordion) that then gets pulled in everywhere
  if (
    id.includes('components/Button/') ||
    id.includes('utils/animationProps')
  ) {
    return 'shared-ui';
  }

  // All ThemeControls components - loaded via requestIdleCallback after LCP
  // This keeps the entire theme UI out of the critical path
  if (
    id.includes('ThemeControls/') ||
    id.includes('hooks/theme/') ||
    id.includes('hooks/useAccentColor')
  ) {
    return 'theme-controls';
  }

  // Bundle useLazyLoad and localStorage utils together with their consumers
  // This eliminates dependency chains for lazy-loaded components
  if (
    id.includes('hooks/useLazyLoad') ||
    id.includes('utils/storage') ||
    (id.includes('/Lazy') && id.includes('components'))
  ) {
    return 'lazy-utils';
  }

  // Below-fold heavy components - keep these separate so they're only loaded
  // when scrolled into view (via client:visible)
  // These are NOT in the initial viewport and should be deferred
  if (
    id.includes('LoopComponents/FeatureCard') ||
    id.includes('LoopComponents/IconListItem') ||
    id.includes('AnimatedBorder/')
  ) {
    return 'feature-cards';
  }

  // Portfolio showcase - hero component that doesn't need icons
  // Kept separate from carousels to avoid pulling icons into critical path
  if (id.includes('PortfolioScreenShowcase')) {
    return 'portfolio-showcase';
  }

  // Carousels and heavy interactive sections - loaded on scroll
  // These use icons so they pull in the icons chunk
  if (
    id.includes('TestimonialCarousel') ||
    id.includes('PortfolioCarousel') ||
    id.includes('TechStackSection') ||
    id.includes('VideoAccordion')
  ) {
    return 'carousels';
  }

  // Accordion component - below fold FAQ section
  if (
    id.includes('LoopTemplates/Accordion') ||
    id.includes('LoopComponents/AccordionItem') ||
    id.includes('LoopComponents/EnhancedAccordionItem')
  ) {
    return 'accordion';
  }

  // Engagement hooks - only needed for interactive below-fold components
  if (
    id.includes('hooks/autoplay/') ||
    id.includes('hooks/autoscroll/') ||
    id.includes('hooks/interactions/')
  ) {
    return 'engagement-hooks';
  }

  // Icons chunk - all react-icons and icon utilities bundled together
  // Loaded when any component using icons renders
  if (
    id.includes('node_modules/react-icons/') ||
    id.includes('utils/icons/iconMap') ||
    id.includes('utils/icons/iconLoader') ||
    id.includes('utils/icons/iconConfig') ||
    id.includes('components/Icon')
  ) {
    return 'icons';
  }
}

export function assetFileNames(assetInfo) {
  if (assetInfo.name?.endsWith('.css')) {
    if (assetInfo.name.includes('global') || assetInfo.name.includes('base')) {
      return 'assets/critical-[hash][extname]';
    }
    return 'assets/styles-[hash][extname]';
  }
  return 'assets/[name]-[hash][extname]';
}
