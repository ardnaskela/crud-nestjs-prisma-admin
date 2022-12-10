import * as AdminJSPrisma from '@adminjs/prisma'
import AdminJS from 'adminjs'
import { DMMFClass } from '@prisma/client/runtime'
import { Module } from '@nestjs/common'
import { AdminModule } from '@adminjs/nestjs'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'

import importExportFeature from '@adminjs/import-export';
import { PrismaCrudModule } from 'nestjs-prisma-crud'
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';



AdminJS.registerAdapter({
  Resource: AdminJSPrisma.Resource,
  Database: AdminJSPrisma.Database,
})

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => {
        const prisma = new PrismaService()

        const dmmf = ((prisma as any)._baseDmmf as DMMFClass);

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [{
              resource: { model: dmmf.modelMap.user, client: prisma },
              options: {},
              features: [importExportFeature()],
            },
            {
              resource: { model: dmmf.modelMap.post, client: prisma },
              options: {},
            },
            ]
          },
          auth: {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret'
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret'
          },
        }
      }
    }),
    PrismaCrudModule.register({
      prismaService: PrismaService,
    }),
    PostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }