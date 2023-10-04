import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthController } from './google.controller';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
  exports: [GoogleAuthService],
})

export class GoogleAuthModule { }
