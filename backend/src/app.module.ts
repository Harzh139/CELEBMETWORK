import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CelebrityModule } from './celebrity/celebrity.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PdfModule } from './pdf/pdf.module';
import { FollowModule } from './follow/follow.module';

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CelebrityModule,
    UserModule,
    AuthModule,
    PdfModule,
    FollowModule,
  ],
})
export class AppModule {}
