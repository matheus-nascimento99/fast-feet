import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().int().optional().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  REDIS_PORT: z.coerce.number().int().optional().default(6379),
  REDIS_HOST: z.string().ip().optional().default('127.0.0.1'),
  REDIS_DB: z.coerce.number().int().optional().default(0),
})

export type Env = z.infer<typeof envSchema>
