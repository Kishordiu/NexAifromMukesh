const configuredJwtSecret = process.env.JWT_SECRET;
const isPlaceholderSecret = !configuredJwtSecret ||
  /^(your[-_ ]?secret[-_ ]?here|replace[-_ ].*|changeme|change-me)$/i.test(configuredJwtSecret);

if (process.env.NODE_ENV === 'production' &&
    (isPlaceholderSecret || configuredJwtSecret.length < 32)) {
  throw new Error('A unique JWT_SECRET of at least 32 characters must be configured in production.');
}

const JWT_SECRET = configuredJwtSecret || 'nexai-dev-only-secret-change-in-production';
const CLINICIAN_EMAILS = new Set(
  (process.env.CLINICIAN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

module.exports = { JWT_SECRET, CLINICIAN_EMAILS };
