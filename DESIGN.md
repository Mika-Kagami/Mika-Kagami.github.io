# Mika Kagami — Digital Universe

## Creative direction

The homepage is conceived as a quiet cosmic interface: a personal space rather than a sales portfolio. The existing violet celestial artwork remains the recognizable anchor, while deep-black negative space, editorial serif typography, fine orbital geometry, and restrained glass surfaces give it a more cinematic identity.

## Layout and content

- A floating horizontal capsule replaces all sidebar-style navigation.
- The full-viewport hero works as the environmental establishing shot.
- Identity and verified contact details form a concise, easy-to-scan narrative.
- Personal content lives in `src/data/content.js` so it can be edited without changing component logic.
- Portfolio galleries, pricing, services, reviews, project requests, and fabricated metrics are intentionally absent.

## Motion language

- GSAP owns the short first-visit cinematic timeline.
- Motion owns purposeful component interactions, layout feedback, and dialogs.
- CSS handles ambient motion and the lightweight hero entrance.
- Reduced-motion mode removes the intro and continuous animation while preserving all content and navigation.

## Performance and resilience

The onboarding is lazy-loaded, the hero artwork is pre-prioritized, and no WebGL or smooth-scroll layer is used. The experience relies on transform and opacity animation, preserves meaningful content in the initial render, and includes storage, image, and application failure fallbacks.
