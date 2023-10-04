import { Module } from '@nestjs/common';
import { GoogleAuthModule } from 'src/auth/googleAuth/google.module';
import { ApiKeyModule } from './apiKeyAuth/apikey.module';

@Module({
  imports: [ApiKeyModule, GoogleAuthModule],
})
export class AuthModule { }
