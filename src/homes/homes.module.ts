import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomesController } from './homes.controller';
import { HomesService } from './homes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [HomesController],
  providers: [HomesService,{
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor
  }],
  imports:[PrismaModule]
})
export class HomesModule {}
