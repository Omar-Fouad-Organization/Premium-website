export type SponsorCard = {tier: string; tagline: string; price: string; features: string[]; highlight: boolean};

/** Existing CMS publication, type and ordering drive the existing sponsor-card layout. */
export function sponsorCards(rows: Record<string, unknown>[]): SponsorCard[] {
  return rows.filter(row => row.package_type === 'sponsor' && row.is_active === true)
    .sort((a,b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0))
    .map(row => ({tier: String(row.package_name ?? ''), tagline: '', price: String(row.price ?? ''),
      features: Array.isArray(row.features) ? row.features.filter((value): value is string => typeof value === 'string') : [], highlight: row.is_popular === true}));
}
