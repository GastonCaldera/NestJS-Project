import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.MONGODB_DATABASE_HOST}`),
    UserModule,
    FileModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
