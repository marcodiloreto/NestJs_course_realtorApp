import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomesModule } from './homes/homes.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {UserInterceptor} from './user/interceptor/user.interceptor'
import { AuthGuard } from './user/auth/guards/auth.guard';

@Module({
  imports: [UserModule, PrismaModule, HomesModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass:UserInterceptor
  },{
    provide:APP_GUARD,
    useClass:AuthGuard
  }],
})
export class AppModule {}
