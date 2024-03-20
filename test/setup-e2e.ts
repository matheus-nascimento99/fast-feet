import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'

import { DomainEvents } from '@/core/events/domain-events'

const prisma = new PrismaClient()

const generateDatabaseUrl = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Environment variable DATABASE_URL not found.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

const schema = randomUUID()

beforeAll(() => {
  const newUrlDatabase = generateDatabaseUrl(schema)

  process.env.DATABASE_URL = newUrlDatabase

  DomainEvents.shouldRun = false

  execSync(`npx prisma migrate deploy`)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await prisma.$disconnect()
})
