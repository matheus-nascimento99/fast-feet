import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '@/auth/auth.module'

import { PrismaService } from './database/prisma/prisma.service'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { AuthenticateController } from './http/controllers/authenticate.controller'
import { CreateUserController } from './http/controllers/create-user.controller'
import { HttpModule } from './http/controllers/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (obj) => envSchema.parse(obj),
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  controllers: [CreateUserController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
