import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '../src/users/users.module';
import { AuthModule } from './auth/auth.module';
import { CreatorModule } from './creator/creator.module';
import { BusinessModule } from './business/business.module';
import { ChatModule } from './chat/chat.modules';
import { PaymentsModule } from './payment/payment.module';
import { UploadModule } from './supabase/upload.module';

import { CategoriesModule } from "./common/categories.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UsersModule,
    AuthModule,
    CreatorModule,
    BusinessModule,
    PaymentsModule,
    ChatModule,
    UploadModule,
    CategoriesModule,
  ],
})
export class AppModule {}