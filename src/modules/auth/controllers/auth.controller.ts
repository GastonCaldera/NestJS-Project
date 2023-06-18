import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private appService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    return req;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return this.appService.googleLogin(req);
  }
}
