// Feature flags. These are read at build time, so a disabled feature's code
// and data are dropped from the production bundle entirely.

/**
 * Bantay Opisyal — the officials track-record registry (/officials,
 * /officials/:id, /officials/contribute, /admin) plus the "Concerns" and
 * "Court cases" sections on official profiles.
 *
 * Hidden by default. Set `VITE_ENABLE_BANTAY_OPISYAL=true` to turn it back on.
 */
export const BANTAY_OPISYAL_ENABLED =
  import.meta.env.VITE_ENABLE_BANTAY_OPISYAL === 'true';
