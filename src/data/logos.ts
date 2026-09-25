// Logo walls. To add a logo: drop the file into src/assets/images/ (customers) or
// src/assets/images/Storefront/ (storefronts), then add the file name and company name below.
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/images/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });
const img = (path: string) => {
  const hit = all[`../assets/images/${path}`];
  if (!hit) throw new Error(`Logo not found: src/assets/images/${path}`);
  return hit.default;
};

/** `scale` enlarges logos whose files have lots of empty space around them (1 = normal). */
export interface Logo { name: string; src: ImageMetadata; scale: number }

/** "Trusted by 100+ SaaS ISVs" — the customer logo wall from the legacy homepage. */
export const customerLogos: Logo[] = [
  ['New Relic', 'newrelic.svg'],
  ['Druva', 'Druva_Logo_tagline_Color.svg'],
  ['Freshworks', 'freshworks-logo-png.png', 1.6],
  ['Postman', 'Postman--Streamline-Svg-Logos.svg'],
  ['HashiCorp', 'hashicorp-ar21.svg', 1.3],
  ['Arctic Wolf', 'arcticwolf.png', 1.5],
  ['Kore.ai', 'kore-ai-logo-png_seeklogo-504534.png', 1.9],
  ['Fastly', 'Fastly--Streamline-Svg-Logos.svg'],
  ['BeyondTrust', 'beyondtrust.svg'],
  ['Jamf', 'Jamf color dark.png'],
  ['ClickHouse', 'clickhouse-1.svg'],
  ['ZoomInfo', 'ZI logo_light.svg'],
  ['Denodo', 'denodo.svg'],
  ['SAFE Security', 'Safe one Light-logo.svg'],
  ['PharmacoEvidence', 'pharmocoevidence-logo.png', 1.6],
  ['Dataminr', 'dataminr-logo.png'],
  ['Simplesense', 'simplesense-logo.png', 1.3],
  ['GuardDog', 'guarddog-logo.png', 1.7],
  ['Nexla', 'nexla-logo.png', 1.9],
].map(([name, file, scale]) => ({ name: name as string, src: img(file as string), scale: Number(scale ?? 1) }));

/** Companies on AWS Marketplace Storefront with SaaSNova (legacy storefront page). */
export const storefrontLogos: Logo[] = [
  ['Snyk', 'snyk-logo.png'],
  ['Tenable', 'TENABLE-logo.png'],
  ['Postman', 'Postman--Streamline-Svg-Logos.svg'],
  ['Canonical', 'Canonical-Logo.png'],
  ['SUSE', 'suse-logo.png', 1.5],
  ['Sage', 'sage-logo.png'],
  ['Apptio', 'Apptio-Logo.svg'],
  ['Jamf', 'Jamf color dark.png'],
  ['Carahsoft', 'carahsoft.svg'],
  ['Kore.ai', 'kore-ai-logo-png_seeklogo-504534.png', 1.9],
  ['Nexla', 'nexla-logo.png', 1.9],
  ['Hydrolix', 'hydrolix-logo.png'],
  ['WorkSpan', 'workspan-logo.jpeg', 1.9],
  ['SaaSify', 'saasify-logo.png', 1.5],
  ['Fractal', 'fractal-logo.png'],
  ['Relevance Lab', 'Relevancelab_logo.png'],
  ['TrackIt', 'TrackIt-logo.png'],
  ['Pronix', 'pronix_inc_logo.jpeg', 1.6],
  ['Penta Security', 'pentasecurity-logo.png'],
  ['SAFE Security', 'Safe one Light-logo.svg'],
  ['GuardDog', 'guarddog-logo.png', 1.7],
  ['Rysun', 'Rysun-Logo.png'],
  ['NetCom Learning', 'netcomlearning-logo.png', 1.6],
  ['AsirTech', 'asirtech-logo.png', 1.4],
  ['cStream', 'cstream-logo.png', 1.4],
  ['Simplesense', 'simplesense-logo.png', 1.3],
  ['PharmacoEvidence', 'pharmocoevidence-logo.png', 1.6],
  ['Aivar', 'aivar-logo.png', 1.4],
  ['Alertd', 'Alertd-logo.png', 1.4],
  ['Big Cheese', 'bigcheese-logo.png'],
  ['The Female Quotient', 'FQ-logo.jpeg', 1.5],
].map(([name, file, scale]) => ({ name: name as string, src: img(`Storefront/${file}`), scale: Number(scale ?? 1) }));
