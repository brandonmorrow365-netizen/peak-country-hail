# Motion and 3D foundation

The production application is Astro 7 on Cloudflare Workers. It was already established before the 3D brief and remains intact. Semantic HTML and static imagery are the baseline experience.

- GSAP/ScrollTrigger is isolated in `ScrollAnimation.astro`, loaded dynamically, and skipped for reduced motion.
- Three.js, React Three Fiber, Drei, and Spline runtimes are installed for future asset work. They are not loaded by current routes.
- `ThreeScene.astro` and `SplineScene.astro` are progressive-enhancement boundaries with accessible static fallbacks.
- Spline MCP connected successfully on 2026-09-04. A small branded hailstone/platform connectivity scene was created and verified in the Spline Desktop editor. No production scene has been built yet.
- Future models belong in `public/models`; Spline artifacts belong in `public/spline`; optimized imagery belongs in `public/images`.
- Completed scenes must stop rendering off-screen, offer touch and keyboard controls where interactive, and avoid loading multiple heavy scenes together.
