export const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  publicAppUrl: process.env.PUBLIC_APP_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'NursePath <onboarding@resend.dev>',
  contactToEmail: process.env.CONTACT_TO_EMAIL || 'support@nursepath.com',
};

export function validateConfig() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }
  if (!config.publicAppUrl) {
    throw new Error('PUBLIC_APP_URL is required (e.g. http://localhost:3000)');
  }
  if (!config.stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  if (!config.stripeWebhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is required');
  }
}
