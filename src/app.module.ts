import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/apiKeyAuth/apikey.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OpinionsModule } from './opinions/opinions.module';
import { KeywordsModule } from './keywords/keywords.module';
import { ProductsImagesModule } from './products-images/products-images.module';
import User from './users/user.entity';
import Product from './products/products.entity';
import Opinion from './opinions/opinions.entity';
import Keyword from './keywords/keywords.entity';
import ProductImages from './products-images/products-images.entity';
import { S3Module } from './S3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // Read all entities inside src
      // entities: [__dirname + '/src/**/*.entity{.ts,.js'],
      entities: [User, Product, ProductImages, Opinion, Keyword],
      // Not recommended to use on prod, this is to sync db tables with ptoject tables
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OpinionsModule,
    KeywordsModule,
    ProductsImagesModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
