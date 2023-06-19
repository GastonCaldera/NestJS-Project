import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignInGoogleDto } from '../dtos/signin-google.dto';

@Controller('auth')
export class AuthController {
  constructor(private appService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    return req;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: SignInGoogleDto) {
    return this.appService.googleLogin(req);
  }
}
