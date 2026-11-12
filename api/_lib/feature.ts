// Server-side mirror of the client's Bantay Opisyal feature flag
// (src/config/features.ts). Uses the same env var so one setting controls both.
export const bantayOpisyalEnabled = () =>
  process.env.VITE_ENABLE_BANTAY_OPISYAL === 'true';
