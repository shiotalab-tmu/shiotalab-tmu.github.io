/** frontmatterのdate ("YYYY-MM-DD") から年度を導出する */
export function paperYear(date: string): number {
  return parseInt(date.slice(0, 4), 10);
}
