import dotenv from 'dotenv'

dotenv.config()

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value !== undefined) return value
  if (defaultValue !== undefined) return defaultValue
  throw new Error(`Environment variable ${key} is not set`)
}

export const config = {
  stripe: {
    publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    proPriceId: getEnvVar('STRIPE_PRO_PRICE_ID'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET_KEY'),
  },
  maxFreeTodos: Number(process.env.MAX_FREE_TODOS || 5),
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
}