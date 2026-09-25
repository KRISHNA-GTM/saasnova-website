# SaaSNova website playbook (for non-technical editors)

This playbook explains how the website gets from your computer to the internet, and how to make
everyday changes yourself without writing code.

```
 You edit a file on GitHub ──► GitHub builds a TEST site automatically (2–3 min)
                                  │  check it in your browser
                                  ▼
            You press "Go live" on GitHub ──► www.saasnova.ai updates (S3 + CloudFront, ~5 min)
```

Nothing reaches www.saasnova.ai until you press **Go live**. If something looks wrong on the
test site, fix it or undo it before going live.

---

## Part 1. One-time setup (about 45 minutes, do it once)

### A. Put the website on GitHub (test site)

1. Create a GitHub account at github.com (use operations@saasnova.ai), then create an
   **organization** called `saasnova` (free).
2. Create a new repository named `saasnova-website`.
   - **Private** is recommended. GitHub Pages on a private repository needs the GitHub **Team**
     plan (about $4 per user per month). A **public** repository is free, but anyone can read the
     code. The code contains no passwords, but it does show unpublished drafts.
3. Install **GitHub Desktop** (desktop.github.com) and sign in.
4. In GitHub Desktop choose **File → Add local repository**, then pick this folder:
   `F:\SaasNova(F)\05_Web\saasnova-site-ACTIVE-github - Copy\website`
   It will say "this is not a Git repository". Click **create a repository**, then **Publish
   repository** and choose `saasnova/saasnova-website`.
   - Upload only the `website` folder. Do **not** upload `Ref-SN` (brand guidelines, deck) or the
     old site files next to it.
5. On github.com open the repository, then **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
6. Open the **Actions** tab. The workflow **Test site (GitHub Pages)** runs. When it shows a green
   tick, open **Settings → Pages** to find the address, e.g.
   `https://saasnova.github.io/saasnova-website/`.

**Optional: a nicer test address (test.saasnova.ai).**
In GoDaddy DNS add a `CNAME` record: name `test`, value `saasnova.github.io`. In GitHub go to
**Settings → Secrets and variables → Actions → Variables** and add `STAGING_DOMAIN` =
`test.saasnova.ai`. Then go to **Settings → Pages**, enter the custom domain and tick **Enforce
HTTPS**.

The test site is always hidden from Google (it sends "noindex" and blocks crawlers).

### B. Connect GitHub to AWS (live site)

Ask whoever manages AWS to do this once (about 15 minutes):

1. In AWS IAM, create a user `github-website-deploy` with **only** this permission policy. Replace
   `BUCKET` and `ACCOUNT_ID/DISTRIBUTION_ID` with your real values.
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::BUCKET" },
       { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::BUCKET/*" },
       { "Effect": "Allow", "Action": ["cloudfront:CreateInvalidation"], "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID" }
     ]
   }
   ```
2. Create an access key for that user.
3. In GitHub go to **Settings → Secrets and variables → Actions**.
   - Under **Secrets**, add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
   - Under **Variables**, add `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` and `AWS_REGION` (for
     example `us-east-1`).
4. In GitHub go to **Settings → Environments → New environment** and name it `production`. Add
   yourself and Jen as **Required reviewers**, so that nobody can go live without an approval
   click.
5. **Before the first go-live**, attach the CloudFront Function (`deploy/cloudfront-function.js`)
   to the distribution, as described in `docs/HOSTING-AND-DEPLOYMENT.md`. It keeps every old
   `.html` link and Google result working.

Never paste AWS keys anywhere else: not in files, emails or chat.

---

## Part 2. Everyday changes (about 5 minutes each)

The way to edit is the same every time:

1. Open the file on github.com (the table below says which one).
2. Click the **pencil icon** (Edit).
3. Change **only the text between the quotes** `'like this'`. Keep the quotes, commas and brackets
   exactly as they are.
4. Click **Commit changes…**, write a short note (e.g. "Update Ignite impact"), then commit to
   `main`.
5. Wait 2–3 minutes, then check the **Actions** tab.
   - Green tick: open the test site and check your change.
   - Red cross: open it and read the error. Usually a quote or comma was deleted. Fix the line,
     or undo the change (Part 4).

| I want to… | Edit this file | Notes |
|---|---|---|
| Change a flagship program (What You Get, Impact, Ideal stage, duration) | `src/data/offerings.ts` | Look for `flagship:` under `ignite`, `supernova` or `novax` |
| Change a solution's description | `src/data/offerings.ts` | Each solution starts with `slug:` |
| Add or edit a testimonial | `src/data/testimonials.ts` | Copy an existing block. `page:` decides where it shows (`'home'`, `'arctic-wolf'`, `'dataminr'`, `'storefront'`). Each quote appears on one page only |
| Add a customer or storefront logo | Upload the image to `src/assets/images/` (or `.../Storefront/`), then add a line in `src/data/logos.ts` | On github.com use **Add file → Upload files**. PNG or SVG, transparent background |
| Change the Calendly link or the main button text | `src/data/site.ts` | `primaryCta` is the one booking button used everywhere |
| Change the top menu | `src/data/nav.ts` | |
| Publish a blog post | Copy any file in `src/content/insights/` and rename it | The file name becomes the URL. Put the cover image in `public/media/insights/` |
| Publish news or a press release | `src/content/news/` | Same as blog posts |
| Add an event or campaign page | `src/content/campaigns/` | Follow `_examples/README.md` |
| Homepage questions (FAQ) | `src/pages/index.astro`, find `const faqs` | Edit the text inside the quotes only |
| Case study numbers or text | `src/data/track-record.ts` | |

**Blog post template.** Everything between the `---` lines is required:

```
---
title: "Your headline"
description: "One or two sentences for Google and social cards."
date: "2026-10-01"
author: "Jen Dawson"
readingTime: 5
tags: ["AWS Marketplace", "Co-sell"]
heroImage: "/media/insights/your-cover.webp"
---

<p class="lead-para">Your opening line.</p>

<h2>First section heading</h2>
<p>Paragraph text…</p>
```

Every `<h2>` automatically appears in the article's table of contents.

---

## Part 3. Go live

1. Check the test site first.
2. On github.com open **Actions → Go live (AWS S3 + CloudFront) → Run workflow**.
3. Type `GO-LIVE` in the box and click **Run workflow**. An approver clicks **Approve** if you set
   up reviewers.
4. After about 5 minutes, www.saasnova.ai shows the change. Use a private browser window to
   check.

---

## Part 4. Undo a mistake

1. On github.com open **Commits** (the clock icon above the file list).
2. Open the bad commit, click **⋯ → Revert**, then commit.
3. The test site rebuilds. If the mistake had already gone live, run **Go live** again.

---

## Part 5. Brand rules (check before every commit)

- Say **execution, implementation, deployment**. Never say "consulting", "advisory",
  "recommendations", "strategic guidance" or "strategy firm".
- The menu and the site say **Solutions**, not "services".
- Don't name competitors, and don't link to their websites.
- Pricing: say "custom program, scoped on a 30-minute call". Never say "we do not publish prices".
- AWS wording: "Available on AWS Marketplace". Never say "Powered by AWS" or "AWS-certified".
- Testimonial quotes are approved text. Never edit their wording, and don't repeat a quote on a
  second page.
- Colors: Blue `#008BF8`, Pink `#FA0F9C`, Orange `#F19953`, White. Font: Inter.

---

## Part 6. Bigger changes

For a new page design, a new section or anything beyond text, open this folder in Claude Code and
describe the change in plain words. For example: "Add a Nexla case study page like the Arctic Wolf
one". Then review the test site and go live as usual.

---

## Part 7. Domain (GoDaddy now, Route 53 later)

Today GoDaddy holds the domain and points `www.saasnova.ai` at CloudFront. GoDaddy can't point the
bare `saasnova.ai` at CloudFront, so it uses GoDaddy forwarding to `www`. When the GoDaddy
subscription ends:

1. In Route 53, create a hosted zone for `saasnova.ai`.
2. Recreate every record, including email (MX, SPF, DKIM), HubSpot and Google verification.
3. Add **Alias** records for `saasnova.ai` and `www` pointing to the CloudFront distribution.
4. In GoDaddy, change the domain's nameservers to the four Route 53 nameservers.

Plan this with whoever manages email, because a missed MX record stops email.
