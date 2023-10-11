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
import User from './users/user.entity';
import Product from './products/products.entity';
import Opinion from './opinions/opinions.entity';
import Keyword from './keywords/keywords.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'GIAN_PG_ADMIN_DB_PS',
      database: 'GC-store',
      // Read all entities inside src
      // entities: [__dirname + '/src/**/*.entity{.ts,.js'],
      entities: [User, Product, Opinion, Keyword],
      // Not recommended to use on prod, this is to sync db tables with ptoject tables
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OpinionsModule,
    KeywordsModule
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
export class AppModule { }
