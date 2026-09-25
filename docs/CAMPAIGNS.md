# Campaign pages

Jen's brief: campaign landing pages tied to a specific campaign, demand-gen microsites for AWS
solutions, co-branded pages with AWS branding and messaging, event registration pages, and content
syndication pages. All five are supported by one page builder.

## How it works

Each page is one YAML file in `src/content/campaigns/`. The file name is the URL slug.

| `kind` | URL | Typical use |
|---|---|---|
| `campaign` | `/campaigns/<slug>` | One offer, one audience, one form (paid, email, LinkedIn, event follow-up) |
| `microsite` | `/campaigns/<slug>` | A longer page around one AWS solution area, several sections |
| `cobranded` | `/campaigns/<slug>` or a custom `path` | Joint pages with AWS or a partner (FQ Source is live at `/fq-source`) |
| `event` | `/events/<slug>` | Webinar or partner-event registration; listed on /events until it starts; Event structured data |
| `syndication` | `/campaigns/<slug>` | Gated AWS-related content; after the form, the visitor goes to the asset |

A page is a hero (with its own HubSpot form) plus any mix of sections: `stats`, `text`, `points`,
`steps`, `quote`, `partners`, `image`, `agenda`, `speakers`, `faq`, `cta`. The schema in
`src/content.config.ts` validates every file at build time, so a typo fails the build instead of
publishing a broken page.

Templates with comments: `src/content/campaigns/_examples/` (never published).

## Launch checklist

1. Create a **dedicated HubSpot form** for the campaign; copy its GUID into `form.hubspotFormId`.
   Field `name`s must be HubSpot internal property names on that form, and select values must match
   the property options exactly (see FORMS-AND-INTEGRATIONS.md).
2. Copy the right template, rename it, fill every value, set `draft: false`.
3. Put images in `public/campaigns/<slug>/` (WebP, under 200 KB).
4. For AWS logos or joint AWS messaging, get **written AWS approval** first and record the
   reference in `cobrand.awsApprovalRef`. The build refuses `awsLogo: true` without it. AWS rules: your
   logo leads, the AWS mark is secondary and never larger than yours, one AWS logo treatment per page,
   and the "Available in AWS Marketplace" badge and co-branded lockups need AWS approval.
5. Set `expires` for anything time-bound, and `noindex: true` for paid-traffic pages that duplicate
   site content.
6. Build and check locally (`npm run dev`), then deploy.
7. Use UTM links in the campaign (`?utm_source=linkedin&utm_campaign=<campaignId>`). The full URL is
   sent to HubSpot with each submission.

## FQ Source

`src/content/campaigns/fq-source.yaml` is the migrated FQ Source page (AWS, The Female Quotient and
SaaSNova). The AWS logo is carried over from the live legacy page, with a note to confirm the written
approval is on file. The registration form now sends valid `aws_partner_status` values (the legacy
page sent a value HubSpot doesn't have).
