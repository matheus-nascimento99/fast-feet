import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

const generateDatabaseUrl = (schema: string) => {
  if (!env.DATABASE_URL) {
    throw new Error('Environment variable DATABASE_URL not found.')
  }

  const url = new URL(env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

const schema = randomUUID()

beforeAll(async () => {
  const newUrlDatabase = generateDatabaseUrl(schema)

  env.DATABASE_URL = newUrlDatabase

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await prisma.$disconnect()
})
