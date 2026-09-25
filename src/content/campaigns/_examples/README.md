# Campaign page templates

Files in this `_examples/` folder are **never built**. Copy one into `src/content/campaigns/`,
rename it (the file name becomes the URL slug), replace every value, and set `draft: false`.

| Template | Kind | Published URL | Use it for |
|---|---|---|---|
| `campaign.yaml` | `campaign` | `/campaigns/<slug>` | A landing page tied to one campaign (paid, email, LinkedIn) |
| `microsite.yaml` | `microsite` | `/campaigns/<slug>` | A multi-section lead-capture page for one AWS solution area |
| `cobranded.yaml` | `cobranded` | `/campaigns/<slug>` | Pages carrying AWS (or partner) branding and joint messaging |
| `event.yaml` | `event` | `/events/<slug>` | Webinar or partner-event registration |
| `syndication.yaml` | `syndication` | `/campaigns/<slug>` | Gated AWS-related content (guide, report); redirects to the asset after submit |

## Rules that the build enforces

- **AWS logos need written approval.** If `cobrand.awsLogo: true`, you must set
  `cobrand.awsApprovalRef` (the approval email/ticket reference). The build fails otherwise.
  AWS guidance: your logo leads; the AWS mark is secondary, never larger than yours, and
  appears once per page. "Available in AWS Marketplace" and co-branded lockups require AWS approval.
- **Every page needs its own HubSpot form** (`form.hubspotFormId`) so leads are attributed to the
  campaign. Field `name` values must be HubSpot internal property names that exist on that form;
  select/checkbox `value`s must match the property's options exactly, or HubSpot rejects the submission.
- **Expiry.** Set `expires` for anything time-bound. After that date the form is replaced by
  `closedMessage` on the next build/deploy.
- **Indexing.** Paid-traffic pages that duplicate site content should use `noindex: true`.
- Put images in `public/campaigns/<slug>/` and reference them as `/campaigns/<slug>/file.webp`.

## Local preview

`npm run dev`, then open the page URL. Set `draft: false` temporarily to preview; drafts are skipped.
