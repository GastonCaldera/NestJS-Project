import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/models/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGODB_DATABASE_HOST}`),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
