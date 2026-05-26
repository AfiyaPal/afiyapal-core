# AfiyaPal SEO, GEO, AI Search, and Healthcare Trust Audit

## Executive Summary

The project had a functional App Router foundation but minimal SEO implementation: root metadata only, no sitemap/robots/manifest, limited schema, weak AI-search guidance, and inconsistent healthcare disclaimer placement. The refactor adds centralized metadata, structured data, crawler controls, AI-readable files, public route optimization, protected route no-indexing, and safer healthcare trust language.

## Key Risks Found

- Public healthcare pages lacked strong canonical and Open Graph metadata.
- No dynamic sitemap existed for blogs/events.
- Protected admin, doctor, and facility routes were not explicitly no-indexed.
- AI answer engines had no `llms.txt` or retrieval guidance.
- Healthcare pages needed clearer disclaimers and emergency limitations.
- Structured data was absent, limiting rich-result and AI retrieval clarity.
- Header/footer internal linking did not fully reinforce target healthcare entities.

## Implemented Improvements

### Technical SEO

- Added metadata utilities and canonical URL generation.
- Added dynamic sitemap with static, blog, and event routes.
- Added robots policy for standard crawlers and AI crawlers.
- Added web app manifest.
- Added dynamic Open Graph/Twitter images.
- Added no-index metadata for protected app areas.
- Improved internal navigation labels and footer links.

### GEO and AI Search

- Added `public/llms.txt`.
- Added `public/ai.txt`.
- Added entity-first summaries and safety instructions.
- Added FAQ content and schema.
- Added retrieval-friendly homepage sections.
- Reinforced AfiyaPal, TalonArch, AI healthcare Africa, symptom checker Kenya/Africa, and public health intelligence entities.

### Structured Data

- Added reusable schema helpers for organization, website, app, medical webpage, FAQ, article, breadcrumb, and event data.
- Added JSON-LD renderer with safe serialization.
- Added article schema to blog details.
- Added event schema to public event details.

### Healthcare Trust and Legal Risk

- Added medical disclaimers to homepage, chatbot, footer, and article details.
- Clarified pilot status and minimum intended age.
- Avoided claims of diagnosis, certification, emergency service, or completed partnerships.
- Made AI retrieval guidance explicitly safety-bounded.

### Accessibility

- Added skip link.
- Improved semantic landmarks.
- Added chatbot input label and descriptive associations.
- Added active navigation state.
- Added breadcrumb markup for articles.

### Performance

- Configured AVIF/WebP image support.
- Added immutable cache headers for static images.
- Kept schema and metadata server-side.
- Kept protected routes out of crawling paths.

## Deployment Recommendations

1. Set `NEXT_PUBLIC_APP_URL=https://www.afiyapal.co.ke` in Vercel.
2. Verify sitemap, robots, manifest, llms, ai, OG image, and Twitter image routes after deployment.
3. Submit sitemap to Google Search Console and Bing Webmaster Tools.
4. Add privacy policy, terms, consent, and data retention pages before public health data scale.
5. Implement Swahili routes before enabling Swahili hreflang URLs.
6. Add verified author/reviewer profile pages for medical content.
7. Run Lighthouse and WebPageTest on deployed previews.
