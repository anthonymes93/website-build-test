# Rockstar Landscaping

A responsive two-page landscaping website with a homepage, inspiration gallery, and quote form.

## Pages
- `index.html` — homepage, services, about, quote form
- `gallery.html` — landscaping inspiration images (not real completed projects)
- `styles.css` — shared styling
- `site.js` — quote form submission and copyright year
- `api/quote.js` — Vercel serverless handler that sends quote emails through Resend

## Deploy to Vercel
Import this GitHub repository as a Vercel project. Use **Other** as the framework preset, with no build command. Vercel serves the HTML files and deploys the `/api/quote` endpoint.

### Required environment variables
Configure these in Vercel Project Settings → Environment Variables, then redeploy:
- `RESEND_API_KEY` — your Resend API key
- `QUOTE_FROM_EMAIL` — verified sender, e.g. `Rockstar Landscaping <quotes@yourdomain.com>`
- `QUOTE_TO_EMAIL` — mailbox that should receive quote requests

Verify the sender domain with Resend before testing. Never commit API keys to GitHub. Without the environment variables, quote submissions return a clear configuration error and **do not send emails**.

## Before publishing for real customers
- Replace inspiration stock photographs with licensed images and real approved project images (if available).
- Confirm the listed services are actually offered, and add service area, business phone, and contact email.
- Add a suitable privacy policy and business identity/contact information.
- Add production spam protection (such as Cloudflare Turnstile with server-side verification), rate limits, and monitoring before promoting the form widely.
- Test the form end-to-end on the deployed Vercel URL.

## Local preview
Open the HTML pages in a browser for visual preview. The quote endpoint runs only when deployed to Vercel or under a compatible local serverless runtime.
