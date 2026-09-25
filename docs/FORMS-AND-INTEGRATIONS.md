# Forms and integrations

## HubSpot (portal 245317385)

All forms post from the browser to the HubSpot Forms API v3 submit endpoint
(`https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`). This endpoint is
designed to be called without authentication; the portal ID and form GUIDs are public identifiers.
**Never add a HubSpot private app token to the front end.**

| Form | Page(s) | Form GUID | Fields sent |
|---|---|---|---|
| Service inquiry | /contact (Work with SaaSNova tab); /community/gcp | `aa170816-bdf0-44f2-a14c-97dd671d1762` | firstname, lastname, email, company, target_cloud_marketplace_s_, current_marketplace_status (when it maps), primary_service_of_interest, what_is_your_biggest_cloud_gtm_challenge_ |
| Partnership inquiry | /contact (Partner tab, `?type=partnership`) | `3427559f-e65d-4cfd-b29b-26ba43a79822` | firstname, lastname, email, company_name, tell_us_what_you_re_looking_to_explore_together_ |
| Newsletter (The Nova Brief) | footer on every page, /newsletter | `80375307-028c-4c4f-819c-96dc9e0f6727` | email |
| Support | /support | `d88c0d3b-b8fc-4f69-887b-abf0a72e4d0d` | firstname, lastname, email, company, category, issue_description |
| Careers | /careers | `094ad5f6-008f-4614-9d45-ce72e96744d2` | firstname, lastname, email, city, hs_linkedin_url, role, why_this_role, relevant_background + consent |
| AWS community | /community/aws | `aece4860-81f1-445e-90de-fb19aa8dd467` | firstname, lastname, email, jobtitle, aws_division, primary_office_location, city, state, country, i_want_to_receive_invitations_for, how_did_you_hear_about_saasnova, message + consent |
| Azure community | /community/azure | `7454a488-0db9-4644-a745-fc9981a034c1` | as AWS, with azure_division__org |
| FQ Source | /fq-source | `23f93682-eb5a-4e14-a2bc-61813dae92ed` | firstname, lastname, email, company, aws_partner_status, aws_marketplace_status |

Every submission also sends `context.pageUri` (full URL, so UTM parameters are captured),
`context.pageName`, and `hutk` when the HubSpot tracking cookie exists.

### Problems found in the legacy forms (fixed)

Checked against the live HubSpot property definitions on 2026-09-25:

- **Contact form sent invalid dropdown values.** It sent `AWS`, `Azure`, `GCP`, `Multiple` to
  `target_cloud_marketplace_s_`, whose valid options are `AWS Marketplace`, `Azure Marketplace`,
  `GCP Marketplace`, `Multi-Cloud (2 or more)`, `Not Yet Decided`. It also offered `PRMaaS` and
  `PCMaaS` values that don't exist in `primary_service_of_interest`. Depending on form settings, HubSpot either rejects such submissions or drops the invalid values,
  so **legacy contact submissions may have failed or arrived without these fields**. Compare HubSpot
  submissions from /contact against GA4 traffic, and check existing contacts for empty values.
- **FQ Source sent `AWS Partner with a Paid Tier`**; the property's option is
  `Validated or Differentiated Tier`.
- **Azure registration sent invitation values** (`ISV Co-Sell Enablement Sessions`,
  `Azure Marketplace GTM Workshops`, `Special Microsoft Ecosystem Events`) that aren't options of
  `i_want_to_receive_invitations_for`, and the AWS form sent `Marketplace GTM Workshops` instead of
  `Marketplace Activation Workshops`.
- **Registration forms showed "Registration Received!" even when HubSpot rejected the submission.**
- **Blog sidebar signups posted to Netlify**, which is not your host, so they were lost.
- GA4 was loaded twice on most pages (double-counted page views).

The new handler validates in the browser, shows HubSpot rejections honestly, and offers the
fallback email. Visible dropdowns can be richer than HubSpot's options: they map to a valid
property value (`data-map-to`) and the exact choice is written into the message field
(`data-compose`), so nothing is lost.

### Recommended HubSpot changes (not made; your call)

1. Add options to `current_marketplace_status` (e.g. `Listed on one marketplace`) and
   `primary_service_of_interest` (Listing and GTM Launch, Storefront as a Service, BOXaaS, GenAI
   Competency Readiness, PRMaaS, PCMaaS), and update the Ignite/SuperNova labels, which still say
   "1-Month" and "4-Month" (the AWS listings say 3 to 4 weeks and 8 to 10 weeks).
2. Create a dedicated Google Cloud community form with a `gcp_division` property. Until then
   /community/gcp submits to the service inquiry form with details in `message`, as the legacy site did.
3. Create one HubSpot form per campaign page so leads are attributed to the campaign.
4. Confirm reCAPTCHA is **off** on these forms (the Forms API cannot solve it).
5. Decide on HubSpot tracking (`src/data/site.ts` → `integrations.hubspot.tracking`). Turning it on
   links submissions to page-view history and campaign attribution; it sets marketing cookies, so
   pair it with a cookie notice if you have EU/UK visitors.

## Calendly

- Strategy session (primary CTA everywhere): `https://calendly.com/jen-saasnova/founder-strategy-session-scale-your-gtm-via-aws`.
  The legacy `?month=2026-03` parameter (which opened a past month) was removed.
- Storefront strategy meeting: `https://calendly.com/jen-saasnova/aws-marketplace-storefront-strategy-meeting`
  (Storefront page, Storefront as a Service CTA band, Carahsoft).
- The expired `aws-prm-deadline-july-31-act-now` event is no longer linked anywhere.

To track bookings by page, add UTM parameters to the Calendly links in `src/data/site.ts`; Calendly
passes them to HubSpot when the integration is connected.

## AWS Marketplace

Every program and service page links to its listing (`/marketplace/pp/<prodview>`) and to its
**Request private offer** URL (`/marketplace/professionalservices/procurement?productId=...`). IDs live
in `src/data/offerings.ts`. If a listing is re-published with a new ID, change it there.

## Analytics (GA4 `G-185EJ40PT4`)

Loaded once per page with IP anonymization. Events sent:

| Event | When |
|---|---|
| `generate_lead` (`form_name`) | any successful form submission |
| `fq_source_registration` | FQ Source registration (legacy event name kept) |
| `cta_strategy_*` / `cta_private_offer_*` / `cta_storefront_*` | clicks on elements with `data-track` |
| `assistant_open`, `assistant_question` (`mode`) | assistant use |

Mark `generate_lead` as a key event in GA4.
