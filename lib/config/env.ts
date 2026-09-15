export const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  publicAppUrl: process.env.PUBLIC_APP_URL,
  authSecret: process.env.AUTH_SECRET,
  authGoogleId: process.env.AUTH_GOOGLE_ID,
  authGoogleSecret: process.env.AUTH_GOOGLE_SECRET,
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'NursePath <onboarding@resend.dev>',
  contactToEmail: process.env.CONTACT_TO_EMAIL || 'support@nursepath.com',
  cronSecret: process.env.CRON_SECRET,
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
  if (!config.paystackSecretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is required');
  }
  if (!config.paystackWebhookSecret) {
    throw new Error('PAYSTACK_WEBHOOK_SECRET is required');
  }
}
