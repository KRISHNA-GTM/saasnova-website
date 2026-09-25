# Hosting and deployment (S3 + CloudFront, GoDaddy DNS)

The site is a folder of static files (`dist/`). Your existing S3 bucket and CloudFront distribution
can host it; these are the settings it needs.

## One-time setup

### 1. S3 bucket
- Private bucket (Block Public Access on). **Do not** use S3 static website hosting; CloudFront
  reads the bucket through Origin Access Control (OAC).
- Enable **versioning** (instant rollback and a backup of the legacy site).
- Bucket policy: allow `s3:GetObject` for your CloudFront distribution's OAC only (CloudFront
  console generates this policy when you pick OAC).

### 2. CloudFront distribution
- **Origin**: the S3 bucket's REST endpoint (not the website endpoint), with OAC.
- **Alternate domain names**: `www.saasnova.ai` and `saasnova.ai`.
- **Certificate**: ACM certificate in **us-east-1** covering both names.
- **Default root object**: `index.html`.
- **Default behavior (`*`)**: Redirect HTTP to HTTPS; compress objects; cache policy
  `CachingOptimized`; response headers policy from step 4.
- **CloudFront Function** (viewer request) on the default behavior: create a function named
  `saasnova-router` (runtime `cloudfront-js-2.0`), paste `deploy/cloudfront-function.js`, publish,
  associate. **Re-publish it whenever `src/data/redirects.mjs` changes** (the build regenerates it).
- **Custom error response**: HTTP 403 and 404 → response page `/404.html`, response code **404**,
  TTL 60 seconds. (S3 returns 403 for missing keys under OAC.)
- Optional behavior `/_assets/*`: same origin, `CachingOptimized`, no function (the function
  already passes these through; a separate behavior just skips the function invocation cost).

### 3. GoDaddy DNS
GoDaddy DNS cannot point the bare domain (`saasnova.ai`) at CloudFront with a CNAME. Two options:

- **Recommended: move DNS hosting to Route 53** (keep the domain registered at GoDaddy; change the
  nameservers at GoDaddy to the Route 53 hosted zone's four NS records). Then create A/AAAA
  **alias** records for both `saasnova.ai` and `www.saasnova.ai` pointing to the distribution.
  Recreate every existing record first (MX, TXT for email, HubSpot and Google verification).
- **Keep GoDaddy DNS**: `www` → CNAME to `dxxxxxxxx.cloudfront.net`; for the bare domain use
  GoDaddy **Forwarding** (301, forward only) to `https://www.saasnova.ai`. The CloudFront Function's
  apex redirect is then unused but harmless.

Also add the ACM validation CNAME records wherever DNS lives.

### 4. Security headers
Create a response headers policy from `deploy/response-headers-policy.json` (console or
`aws cloudfront create-response-headers-policy --response-headers-policy-config file://deploy/response-headers-policy.json`
after wrapping it as the CLI expects). Start the Content-Security-Policy in **report-only** mode for
a week if you add new third-party scripts, then enforce. If you enable HubSpot tracking
(`integrations.hubspot.tracking = true`), its domains are already in the policy.

## Every deploy

```powershell
cd website
npm ci
.\deploy\deploy.ps1 -Bucket <bucket-name> -DistributionId <distribution-id> -Profile <aws-profile>
```

The script builds (which also regenerates the CloudFront Function and fails on broken links), syncs
fingerprinted assets with a one-year immutable cache, syncs everything else with a 5-minute cache,
sets correct content types for text files, and invalidates `/*`.

The IAM user or role running it needs `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject` on the
bucket and `cloudfront:CreateInvalidation` on the distribution.

**First deploy only**: attach and publish the CloudFront Function first (or in the same change),
because `--delete` removes the legacy `.html` objects and their URLs then depend on the redirects.

## Rebuilds that content needs

The site is static, so date-based content updates on the next build:
- Campaign pages with `expires` close their forms after that date.
- `/events` drops past events (FQ Source's November 9, 2026 launch listing disappears on the first
  build after that date).

A scheduled rebuild (for example a nightly GitHub Actions or AWS CodeBuild job running the deploy
script) removes the need to remember. Without one, redeploy after event dates pass.

## Rollback

S3 versioning lets you restore the previous objects; faster is to redeploy the previous git commit
with the same script. CloudFront Function versions can be rolled back in the console.

## Preview environments (optional)

A second bucket + distribution (for example `preview.saasnova.ai`) with the same function, deployed
from a branch, gives Jen's team a review link for campaign pages before they go live. Keep the
preview out of search results by protecting the whole preview distribution with basic auth (a
CloudFront Function) or a WAF IP allowlist.
