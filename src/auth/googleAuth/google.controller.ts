import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from './google.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) { }

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {
  // }

  @ApiBearerAuth()
  @ApiTags('Google Auth')
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.googleAuthService.googleLogin(req);
  }
}
